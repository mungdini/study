import * as THREE from '../common/three.module.js';
import { VertexNormalsHelper } from '../common/VertexNormalsHelper.js'; // mesh에 대해서 법선 벡터를 시각화 하기 위한 클래스 사용을 위해 import
import { OrbitControls } from '../common/OrbitControls.js';

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
        // ↑ bind하는 이유 > resize 메서드 안에서 this가 가리키는 객체가 이벤트 객체가 아닌 App 클래스 객체가 되도록 하기위함
        this.resize();
        
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel(){
        const rawPositions = [
            -1, -1, 0,
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0
        ];

        // 법선 벡터에 대한 배열 데이터 (자동으로 법선벡터 지정해주는 computeVertexNormals 클래스 사용하지 않고 직접 지정하기 위함)
        const rawNormals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];
        // ↑ mesh의 면으로 봤을 때 면에 대한 수직인 벡터가 모두 (0, 0, 1)이기 때문에 이렇게 추가

        const rawColors = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
            1, 1, 0
        ];

        // uv 좌표 (주석은 rawPositions 좌표와 함께 보기)
        const rawUVs = [
            0, 0, // 이미지 좌측 하단 좌표로 geometry의 정점 좌표(-1, -1, 0)에 맵핑됨
            1, 0, // 이미지 우측 하단 좌표로 geometry의 정점 좌표(1, -1, 0)에 맵핑됨
            0, 1, // 이미지 좌측 상단 좌표로 geometry의 정점 좌표(-1, 1, 0)에 맵핑됨
            1, 1 // 이미지 우측 상단 좌표로 geometry의 정점 좌표(1, 1, 0)에 맵핑됨
        ];

        // Float32Array 객체로 랩핑
        const positions = new Float32Array(rawPositions);
        const normals = new Float32Array(rawNormals);
        const colors = new Float32Array(rawColors); //색상
        const uvs = new Float32Array(rawUVs);
        //////////////////////////////////////////////////////////////////////

        const geometry = new THREE.BufferGeometry();
        
        //geometry에 속성 지정
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // 두번째 인자(3) >> 하나의 정점이 x, y, z 3개의 항목으로 구성된다는 뜻
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3)); // 법선벡터를 geometry에 지정
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // 두번째 인자값이 2인 이유 : uv는 2개의 값이 하나의 uv 좌표를 구성하기 때문

        // vertex index : 삼각형 면을 정의 (반시계 방향으로 정의해야 함!!)
        geometry.setIndex([
            0, 1, 2,
            2, 1, 3
        ]);

        // geometry.computeVertexNormals();
        // ↑ 자동으로 모든 정점에 대한 법선 벡터를 지정해줌
        //   법선 벡터는 광원이 mesh의 표면에 비추는 입사각과 반사각을 계산하여 재잘과 함께 표면의 색상을 결정하는데 사용됨

        // 텍스처 맵핑
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load('../examples/textures/uv_grid_opengl.jpg');

        // 재질 속성 (geometry를 렌더링 하기 위해서는 mesh로 만들어줘야하는데 mesh는 재질이 필요함)
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff, 
            // vertexColors: true,
            map: map,

        });
        const box = new THREE.Mesh(geometry, material); //mesh 생성
        this._scene.add(box); // mesh 추가
        //////////////////////////////////////////////////////////////////////

        // 법선 벡터 시각화(노란선)
        const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        this._scene.add(helper);
        //////////////////////////////////////////////////////////////////////

        // uv : 텍스처 맵핑을 위한 속성
    }

    _setupCamera(){
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    update(time){
        time *= 0.001;
    }

    render(time){
        this._renderer.render(this._scene, this._camera);
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