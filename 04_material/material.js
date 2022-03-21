import * as THREE from '../common/three.module.js';
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
        this.resize();
        
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer)
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
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        this._scene.add(light); // scene 객체 구성요소로 생성
    }


    /* PointsMaterial */
    // _setupModel(){ // PointsMaterial을 적용할 만개의 포인트를 scene에 추가하는 코드
    //     const vertices = [];
        
    //     // 10000개의 좌표 x, y, z 좌표를 -5 ~ 5 사이의 난수값을 지정하여 vertices 배열에 추가하는 코드
    //     for(let i = 0; i < 10000; i ++){
    //         const x = THREE.Math.randFloatSpread(5);
    //         const y = THREE.Math.randFloatSpread(5);
    //         const z = THREE.Math.randFloatSpread(5); 

    //         vertices.push(x, y, z)
    //     }//

    //     // geometry 객체 생성
    //     const geometry = new THREE.BufferGeometry();

    //     // geometry 포지션 속성의 vertices 배열이 Float32BufferAttribute로 랩핑되어 전달됨
    //     geometry.setAttribute( 
    //         'position',
    //         new THREE.Float32BufferAttribute(vertices, 3) 
    //         // 3 >> vertices에 저장된 좌표가, x, y, z 3개가 하나의 좌표라는 것을 의미
    //     );//

    //     const sprite = new THREE.TextureLoader().load(
    //         '../examples/textures/sprites/disc.png'
    //     );

    //     const material = new THREE.PointsMaterial({
    //         map: sprite,
    //         alphaTest: 0.5, // 원의 픽셀값 중 알파값이 알파테스트 값보다 클때만 픽셀이 렌더링 됨
    //         color: '#00ffff', //포인트 색상값
    //         size: 0.1,
    //         sizeAttenuation: true, //포인트가 카메라의 거리에 따라 크기가 감쇄되게 함
    //     });

    //     const points = new THREE.Points(geometry, material);
    //     this._scene.add(points);
    // }


    /* LineBasicMaterial */
    // _setupModel(){
    //     const vertices = [ //line 좌표
    //         -1, 1, 0,
    //         1, 1, 0,
    //         -1, -1, 0,
    //         1, -1, 0,
    //     ];
        
    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute( 
    //         'position',
    //         new THREE.Float32BufferAttribute(vertices, 3) 
    //     );

    //     // LineBasicMaterial 재질
    //     // const material = new THREE.LineBasicMaterial({
    //     //     color: 'yellow'
    //     // });

    //     // LineDashedMaterial 재질 (선의 길이 계산 필요) ***
    //     const material = new THREE.LineDashedMaterial({
    //         color: 0xffff00,
    //         dashSize: 0.2,
    //         gapSize: 0.1,
    //         scale: 4,
    //     });//

    //     // line객체 생성 & 추가
    //     const line = new THREE.Line(geometry, material);
    //     line.computeLineDistances(); //*** dashSize 사이즈만큼 선이 그려지고 gapSize 거리만큼 선이 그려지지 않기를 반복
    //     this._scene.add(line);
    // }


    /**** Mesh ****/
    _setupModel(){
        /* MeshBasicMaterial */
        // const material = new THREE.MeshBasicMaterial({  //mesh를 지정된 색상으로 표현
        //     // 부모 클래스인 material의 속성
        //     visible: true, // 렌더링시 mesh 보일지 말지 여부
        //     transparent: true, // opacity 사용 여부
        //     opacity: 0.5,
        //     depthTest: true,
        //     // ↑ 렌더링 되고 있는 메쉬의 픽셀 위치 z값을 깊이 버퍼값을 이용해 검사 할지 여부
        //     depthWrite: true, 
        //     // ↑ 렌더링 되고 있는 메쉬의 픽셀에 대한 z값을 깊이 버퍼에 기록할지 여부
        //     side: THREE.FrontSide, 
        //     // ↑ 메쉬를 구성하는 면에 대해 앞면만 렌더링 할지 뒷면만 렌더링 할지 둘다 렌더링 할지 설정
        //     //   (FrontSide, BackSide, DoubleSide)
        //     //
        //     color: 0xffff00,
        //     wireframe: false, //mesh를 선 형태로 렌더링할지 여부(false)
        //     /***************************************************/
        //     // Depth Buffer는 깊이 버퍼이고 z 버퍼라고도 한다.
        //     // z 버퍼는 3차원 객체를 카메라는 통해 좌표를 변환시켜 화면상에 렌더링 될 때
        //     // 해당 3차원 객체를 구성하는 각 픽셀에 대한 z값 좌표값을 0 ~ 1 사이로 정규화시킴.
        //     // 이 정규화된 z 값이 저장된 버터가 바로 z 버퍼임. 
        //     // 이 값이 작을수록 카메라에서 가까운 3차원 객체의 픽셀임
    
        //     // z 버퍼 값: -과 1 사이의 값
        //     // 카메라로부터 거리에 z 버퍼값 비례
        //     // z 버퍼값이 작을수록 어두운 색상
        //     /***************************************************/
        // });

        /* MeshLambertMaterial */
        // const material = new THREE.MeshLambertMaterial({
        //     transparent: true,
        //     opacity: 0.5,
        //     side: THREE.DoubleSide,
        //     color: '#d25383',
        //     emissive: 0x555500, // 다른 광원의 영향을 받지 않는 재질 자체에서 방출하는 색상값
        //     wireframe: false,
        // });

        /* MeshPhongMaterial */
        // const material = new THREE.MeshPhongMaterial({
        //     color: 0xff0000, // 재질 색상값
        //     emissive: 0xff0000, // 광원 영향 받지 않는, 재질 자체에서 방출하는 색상값
        //     specular: 0xffff00, // 광원에 의해서 반사되는 색상 (연한회색)
        //     shininess: 10,
        //     flatShading: true, // 평평하게 렌더링할지 여부
        //     wireframe: false,
        // });
        
        /* MeshStandardMaterial ★3차원 객체에서 많이 쓰이는 재질★ */
        // const material = new THREE.MeshStandardMaterial({
        //     color: 0xff0000,
        //     emissive: 0xff0000,
        //     roughness: 0.25, // 거칠기 (최대값 = 1)
        //     metalness: 0.1, // 금속성 (1이면 완전 금속성)
        //     wireframe: false,
        //     flatShading: false,
        // });
        
        /* MeshPhysicalMaterial ★★★3차원 객체에서 가장 많이 쓰이는 재질★★★ */
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            emissive: 0x000000,
            roughness: 1,
            metalness: 0,
            clearcoat: 1, // 0 ~ 1 사이 값. 1에 가까워짋수록 메쉬표면 코딩 효과 높아짐
            clearcoatRoughness: 0, // 코팅에 대한 거칠기 값 (0~1 사이) 1 가까울수록 거칠기 최대
            wireframe: false,
            flatShading: false,
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time){
        this._renderer.render(this._scene, this._camera); // 카메라의 시점에서 렌더링
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // second unit
    }
}

window.onload = function(){
    new App();
}