import * as THREE from 'three';
import maplibregl from 'maplibre-gl';
import type { MilitaryBase } from '../../types';
import type { BaseWithAlert } from '../../hooks/useBaseData';

const METERS_PER_UNIT = 5;

interface ThreeLayerResult {
  layer: maplibregl.CustomLayerInterface;
  setSelection: (baseId: string | null, zoneId: string | null) => void;
}

export function createThreeLayer(
  map: maplibregl.Map,
  bases: BaseWithAlert[],
): ThreeLayerResult {
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let selectedBaseId: string | null = null;
  let selectedZoneId: string | null = null;

  const buildingMeshes: Array<{
    mesh: THREE.Mesh;
    edges: THREE.LineSegments;
    zoneId: string;
    baseId: string;
  }> = [];
  const zoneMeshes: Array<{
    mesh: THREE.Mesh;
    edges: THREE.LineSegments;
    zoneId: string;
    baseId: string;
  }> = [];
  const confluenceGroups: Array<{
    group: THREE.Group;
    baseId: string;
  }> = [];

  function createSceneForBase(base: MilitaryBase, parent: THREE.Group) {
    const { layout } = base;

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(
      layout.grounds.width * METERS_PER_UNIT,
      layout.grounds.depth * METERS_PER_UNIT,
    );
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#0d0d15',
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    parent.add(ground);

    // Zone areas
    layout.zones.forEach((zone) => {
      const zoneGeo = new THREE.PlaneGeometry(
        zone.area.width * METERS_PER_UNIT,
        zone.area.depth * METERS_PER_UNIT,
      );
      const zoneMat = new THREE.MeshStandardMaterial({
        color: zone.color,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      });
      const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
      zoneMesh.rotation.x = -Math.PI / 2;
      zoneMesh.position.set(
        (zone.area.x + zone.area.width / 2) * METERS_PER_UNIT,
        0.5,
        (zone.area.z + zone.area.depth / 2) * METERS_PER_UNIT,
      );
      parent.add(zoneMesh);

      const edgeGeo = new THREE.EdgesGeometry(zoneGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: zone.color,
        transparent: true,
        opacity: 0.2,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.rotation.x = -Math.PI / 2;
      edges.position.copy(zoneMesh.position);
      edges.position.y = 0.8;
      parent.add(edges);

      zoneMeshes.push({ mesh: zoneMesh, edges, zoneId: zone.id, baseId: base.id });
    });

    // Buildings
    layout.buildings.forEach((building) => {
      const zone = layout.zones.find((z) => z.id === building.zoneId);
      const color = zone?.color || '#444';

      const boxGeo = new THREE.BoxGeometry(
        building.size[0] * METERS_PER_UNIT,
        building.size[1] * METERS_PER_UNIT,
        building.size[2] * METERS_PER_UNIT,
      );
      const boxMat = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        emissive: color,
        emissiveIntensity: 0.05,
      });
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const edgeGeo = new THREE.EdgesGeometry(boxGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);

      // Label sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.roundRect(0, 0, 256, 64, 4);
      ctx.fill();
      ctx.fillStyle = '#c0c0d0';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(building.label, 128, 40);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(30, 8, 1);
      sprite.position.set(0, (building.size[1] * METERS_PER_UNIT) + 8, 0);

      const group = new THREE.Group();
      group.position.set(
        building.position[0] * METERS_PER_UNIT,
        building.position[1] * METERS_PER_UNIT,
        building.position[2] * METERS_PER_UNIT,
      );
      group.add(mesh);
      group.add(edges);
      group.add(sprite);
      parent.add(group);

      buildingMeshes.push({ mesh, edges, zoneId: building.zoneId, baseId: base.id });
    });

    // Confluence points
    layout.confluencePoints.forEach((cp) => {
      const zone = layout.zones.find((z) => z.id === cp.zoneId);
      const color = zone?.color || '#00e5ff';

      const group = new THREE.Group();
      group.position.set(
        cp.position[0] * METERS_PER_UNIT,
        cp.position[1] * METERS_PER_UNIT,
        cp.position[2] * METERS_PER_UNIT,
      );

      const cylGeo = new THREE.CylinderGeometry(2, 2.5, 3, 16);
      const cylMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
      });
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.set(0, 1.5, 0);
      group.add(cyl);

      const ringGeo = new THREE.RingGeometry(4, 6, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, 0.5, 0);
      ring.userData = { isPulsingRing: true };
      group.add(ring);

      const light = new THREE.PointLight(color, 0.5, 25);
      light.position.set(0, 5, 0);
      group.add(light);

      parent.add(group);
      confluenceGroups.push({ group, baseId: base.id });
    });
  }

  const layer: maplibregl.CustomLayerInterface = {
    id: 'three-buildings',
    type: 'custom',
    renderingMode: '3d',

    onAdd(_map: maplibregl.Map, gl: WebGLRenderingContext | WebGL2RenderingContext) {
      scene = new THREE.Scene();
      camera = new THREE.Camera();

      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xd0e0ff, 0.8);
      dirLight.position.set(100, 200, 100);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0x00e5ff, 0.3, 500);
      pointLight.position.set(0, 100, 0);
      scene.add(pointLight);

      bases.forEach((base) => {
        const baseGroup = new THREE.Group();
        baseGroup.userData = { baseId: base.id };
        createSceneForBase(base, baseGroup);
        scene.add(baseGroup);
      });

      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl as WebGL2RenderingContext,
        antialias: true,
      });
      renderer.autoClear = false;
    },

    render(_gl: WebGLRenderingContext | WebGL2RenderingContext, args: unknown) {
      const matrix = (args as { defaultProjectionData: { mainMatrix: number[] } }).defaultProjectionData?.mainMatrix;
      if (!matrix) return;

      // Animate pulsing rings
      const time = performance.now() / 1000;
      confluenceGroups.forEach(({ group }) => {
        group.children.forEach((child) => {
          if (child.userData?.isPulsingRing && child instanceof THREE.Mesh) {
            const scale = 1 + Math.sin(time * 2) * 0.3;
            child.scale.set(scale, scale, 1);
            (child.material as THREE.MeshStandardMaterial).opacity =
              0.5 - Math.sin(time * 2) * 0.3;
          }
        });
      });

      updateSelectionVisuals();

      // Position each base group using MercatorCoordinate
      scene.children.forEach((child) => {
        if (child.userData?.baseId) {
          const base = bases.find((b) => b.id === child.userData.baseId);
          if (base) {
            const mc = maplibregl.MercatorCoordinate.fromLngLat(
              [base.location.lng, base.location.lat],
              0,
            );
            const scale = mc.meterInMercatorCoordinateUnits();

            child.position.set(mc.x, mc.y, mc.z || 0);
            child.scale.set(scale, -scale, scale);
            child.rotation.x = Math.PI / 2;
          }
        }
      });

      camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };

  function updateSelectionVisuals() {
    buildingMeshes.forEach(({ mesh, edges, zoneId, baseId }) => {
      const isBaseActive = !selectedBaseId || selectedBaseId === baseId;
      const isZoneSelected = selectedZoneId === zoneId;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const edgeMat = edges.material as THREE.LineBasicMaterial;

      if (isZoneSelected && isBaseActive) {
        mat.opacity = 0.85;
        mat.emissiveIntensity = 0.15;
        edgeMat.opacity = 0.8;
      } else {
        mat.opacity = isBaseActive ? 0.5 : 0.25;
        mat.emissiveIntensity = 0.05;
        edgeMat.opacity = isBaseActive ? 0.3 : 0.15;
      }
    });

    zoneMeshes.forEach(({ mesh, edges, zoneId, baseId }) => {
      const isBaseActive = !selectedBaseId || selectedBaseId === baseId;
      const isSelected = selectedZoneId === zoneId && isBaseActive;
      (mesh.material as THREE.MeshStandardMaterial).opacity = isSelected ? 0.15 : 0.06;
      (edges.material as THREE.LineBasicMaterial).opacity = isSelected ? 0.6 : 0.2;
    });
  }

  function setSelection(baseId: string | null, zoneId: string | null) {
    selectedBaseId = baseId;
    selectedZoneId = zoneId;
    map.triggerRepaint();
  }

  return { layer, setSelection };
}
