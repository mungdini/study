import * as THREE from '../common/three.module.js';
import { OrbitControls } from '../common/OrbitControls.js';
import { VertexNormalsHelper } from '../common/VertexNormalsHelper.js';

class App{
    constructor () {
        const divContainer = document.querySelector('#webgl-container');
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // 3차원 장면 렌더링될 때 부드럽게 표현
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement); // renderer.domElement >> canvas 타입의 DOM 객체
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this); 
        this.resize();
        
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer)
    }

    _setupModel(){
        const textureLader = new THREE.TextureLoader();
        const map = textureLader.load('../images/glass/Glass_Window_002_basecolor.jpg');
        const mapAO = textureLader.load('../images/glass/Glass_Window_002_ambientOcclusion.jpg');
        const mapHeight = textureLader.load('../images/glass/Glass_Window_002_height.png');
        const mapNormal = textureLader.load('../images/glass/Glass_Window_002_normal.jpg');
        const mapRoughness = textureLader.load('../images/glass/Glass_Window_002_roughness.jpg');
        const mapMetalic = textureLader.load('../images/glass/Glass_Window_002_metallic.jpg');
        const mapAlpha = textureLader.load('../images/glass/Glass_Window_002_opacity.jpg');
        // const mapLight = textureLader.load('../images/glass/light.jpg');

        const material = new THREE.MeshStandardMaterial({
            map: map,

            normalMap: mapNormal,

            displacementMap: mapHeight, //메쉬의 지오메트리 좌표를 변형시켜 입체감을 표현
            displacementScale: 0.2,
            displacementBias: -0.15,

            aoMap: mapAO, // aoMap을 사용하면 미리 만들어진 세밀한 그림자와 같은 느낌의 효과를 지정할 수 있음
            aoMapIntensity: 1, // 강도값 (1)

            roughnessMap: mapRoughness, // 이 속성에 대한 맵 이미지의 픽셀값이 밝을수록 거칠기가 강함
            roughness: 0.5, //거칠기 강도 (1)

            //금속재질에 대한 느낌 부여
            metalnessMap: mapMetalic,
            metalness: 0.5, // 기본값이 0이기 때문에 metalness 속성을 따로 부여 안하면 metalnessMap속성만으로는 차이 못느낌

            // alphaMap : 투명도에 대한 map 속성 (이미지의 픽셀 값이 밝을수록 불투명. 완전 검은색일 때 완전히 투명하게 됨)
            alphaMap: mapAlpha,
            transparent: true, //투명도
            side: THREE.DoubleSide, // DoubleSide >> 메쉬의 뒷면은 보이도록(투명도 영향 안받게)

            // lightMap: mapLight, // aoMap처럼 지오메트리 속성에 uv2 데이터를 지정해줘야 함
            // lightMapIntensity: 1,

        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        box.position.set(-1, 0, 0);
        // aoMap 속성 지정과 함께 필요한 속성 2
        box.geometry.attributes.uv2 = box.geometry.attributes.uv;
        ////////////////////////////////////
        this._scene.add(box);

        //normal vector 표시
        // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        // this._scene.add(boxHelper);
        // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
        // this._scene.add(sphereHelper);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 512, 512), material);
        sphere.position.set(1, 0, 0);
        // aoMap 속성 지정과 함께 필요한 속성 2
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
        ////////////////////////////////////
        this._scene.add(sphere);
    }

    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 3;
        this._camera = camera;
        this._scene.add(camera);
    }

    _setupLight(){
        // aoMap 속성 지정과 함께 필요한 속성 1
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // AmbientLight = 모든 메쉬의 전체 면에 대해서 균일하게 비치는 광원
        this._scene.add(ambientLight);
        ////////////////////////////////////

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        // this._scene.add(light);
        this._camera.add(light);
    }

    update(time){
        time *= 0.001; // second unit
    }

    render(time){
        this._renderer.render(this._scene, this._camera); // 카메라의 시점에서 렌더링
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
}

window.onload = function(){
    new App();
}