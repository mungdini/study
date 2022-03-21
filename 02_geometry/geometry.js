import * as THREE from '../common/three.module.js';
import { OrbitControls } from '../common/OrbitControls.js'; // 마우스로 자유롭게 이동 가능
import { FontLoader } from "../common/FontLoader.js"
import { TextGeometry } from "../common/TextGeometry.js"

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
        new OrbitControls(this._camera, this._divContainer)
    }

    // _setupModel(){ // 메쉬 생성하는 코드

    //     /******************************지오메트리 종류******************************** */
    //     // /* 1 */ const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2); 
    //     // 정육면체 형상의 지오메트리 (가로, 세로, 깊이) (1, 1, 1)

    //     // /* 2 */ const geometry = new THREE.CircleGeometry(0.9, 16, Math.PI/2, Math.PI);
    //     // 원판 (반지름, 분할수(세그먼트 수), 시작각, 연장각) (1, 8, 0, 2π)

    //     // /* 3 */ const geometry = new THREE.ConeGeometry(0.5, 1.6, 16, 9, true, 0, Math.PI);
    //     // 원뿔 (원의 반지름, 높이, 둘레방향 분할수, 높이 분할수, 원뿔 밑면 열지 닫을지 여부, 시작각, 연장각) (1, 1, 8, 1, false, 0, 2π)

    //     // /* 4 */ const geometry = new THREE.CylinderGeometry(0.9, 0.9, 1.6, 32, 10, true, 0, Math.PI);
    //     // 원통 (윗면 반지름, 밑면 반지름, 원통 높이, 둘레 방향 분할수, 높이 방향 분할수, 윗면 밑면 열지 닫을지 여부, 시작각, 연장각) (1, 1, 1, 8, 1, false, 0, 2π)

    //     // /* 5 */ const geometry = new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI, 0, Math.PI/2);
    //     // 구 (반지름, 수평방향 분할수, 수직방향 분할수, 수평 시작각, 수평 연장각, 수직 시작각, 수직 연장각) (1, 32, 16, 0, 2π, 0, π)

    //     // /* 6 */ const geometry = new THREE.RingGeometry(0.2, 0.3, 6, 2, 0, Math.PI);
    //     // 2차원형태 반지모양 (내부 반지름, 외부 반지름, 가장자리 둘레방향 분할수, 내부방향 분할수, 시작각, 연장각) (0.5, 1, 8, 1, 0, 2π)

    //     // /* 7 */ const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    //     // 평면 사각형 (너비길이, 높이길이, 너비방향 분할수, 높이방향 분할수) (1, 1, 1, 1)

    //     // /* 8 */ const geometry = new THREE.TorusGeometry(0.9, 0.2, 24, 32, Math.PI);
    //     // 3차원 반지모양 (내부 반지름, 원통 반지름, 방사 방향 분할수, 원통 분할수, 연장각) (1, 0.4, 8, 6, 2π)

    //     // /* 9 */ const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);
    //     // 꼬인 반지모양 (반지름 원통, 반지름 크기, 분할 수, 분할 수, 반복횟수 값, 반복횟수) (0.6, 0.1, 64, 32, 3, 4)
    //     /****************************************************************************** */

    //     const shape = new THREE.Shape();
    //     const x = -2.5, y = -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    //     shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    //     const geometry = new THREE.ShapeGeometry(shape);

    //     const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151}); //정육면체 색
    //     const cube = new THREE.Mesh(geometry, fillMaterial); // mash 생성

    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);
    //     // const line = new THREE.LineSegments(geometry, lineMaterial);

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group); // scene 객체의 구성요소로 추가됨
    //     this._cube = group;
    // }

    // _setupModel(){
    //     const shape = new THREE.Shape();
    //     // shape.moveTo(1, 1);
    //     // shape.lineTo(1, -1);
    //     // shape.lineTo(-1, -1);
    //     // shape.lineTo(-1, 1);
    //     // shape.closePath();

    //     const x = -2.5, y = -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    //     shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }

    // _setupModel(){
    //     class CustomSinCurve extends THREE.Curve{
    //         constructor(scale){
    //             super();
    //             this.scale = scale;
    //         }

    //         getPoint(t){
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = path.getPoints(50); // 커브 구성하는 좌표 개수 (기본값:5) --> 각을 둥글게 설정 가능
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }

    // _setupModel(){
    //     class CustomSinCurve extends THREE.Curve{
    //         constructor(scale){
    //             super();
    //             this.scale = scale;
    //         }

    //         getPoint(t){
    //             const tx = t * 3 - 1.5;
    //             const ty = Math.sin(2 * Math.PI * t);
    //             const tz = 0;
    //             return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    //         }
    //     }

    //     const path = new CustomSinCurve(4);
    //     const geometry = new THREE.TubeGeometry(path, 40, 0.8, 8, true);
    //     // (path, 튜브 진행 방향에 대한 분할수, 원통 반지름 크기, 원통 분할수, 원통 닫을지 말지 여부)(path, 64, 1, 8, false)

    //     const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151}); //정육면체 색
    //     const cube = new THREE.Mesh(geometry, fillMaterial); // mash 생성

    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group); // scene 객체의 구성요소로 추가됨
    //     this._cube = group;
    // }

    // _setupModel(){
    //     const points = [];
    //     for(let i = 0; i < 10; i ++){
    //         points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
    //     }
        
    //     const geometry = new THREE.LatheGeometry(points, 24, 0, Math.PI);
    //     // 회전 (회전시킬 좌표, 분할수, 시작각(3시방향이 0도), 연장각) (points, 12, 0, 2π)

    //     const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151}); //정육면체 색
    //     const cube = new THREE.Mesh(geometry, fillMaterial); // mash 생성

    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
    //     const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);

    //     const group = new THREE.Group();
    //     group.add(cube);
    //     group.add(line);

    //     this._scene.add(group); // scene 객체의 구성요소로 추가됨
    //     this._cube = group;
    // }

    _setupModel(){
        // 텍스트지오메트리: ExtrudeBufferGeometry의 파생 클래스(폰트데이터 필요)
        const fontLoader = new FontLoader();

        //로드폰트 비동기 함수
        async function loadFont(that){
            const url = '../examples/fonts/helvetiker_regular.typeface.json';
            const font = await new Promise((resolve, reject) => {
                fontLoader.load(url, resolve, undefined, reject);
            });

            const geometry = new TextGeometry('GIS', {
                font: font, //-----폰트로더로 얻어온 폰트 객체
                size: 9, //-----텍스트메쉬 크기(100)
                height: 1.8, //-----깊이 값(50)
                curveSegments: 5, //-----하나의 커브를 구성하는 정점의 개수(12)
                // setting for ExtrudeGeometry
                bevelEnabled: true, //-----베벨링 처리 할지말지 여부(true)
                bevelThickness: 0.1, //-----베벨 두께값(6)
                bevelSize: 0, //-----모양 외곽선부터 얼마나 멀리 베벨링 할것인지 에 대한 길이(2)
                bevelSegments: 7, //-----베벨링 단계 수(3)

            });

            const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
            const cube = new THREE.Mesh(geometry, fillMaterial);

            const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
            const line = new THREE.LineSegments(
                new THREE.WireframeGeometry(geometry), lineMaterial);

            const group = new THREE.Group();
            group.add(cube);
            group.add(line);

            that._scene.add(group); // scene 객체의 구성요소로 추가됨
            that._cube = group;
        };
        loadFont(this);

        // const x = -2.5, y = -5;
        // const shape = new THREE.Shape();
        // shape.moveTo(x + 2.5, y + 2.5);
        // shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        // shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        // shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        // shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        // shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        // shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        // const settings = { // ExtrudeBufferGeometry 설정값
        //     steps: 2, // 깊이 방향으로의 분할수(1)
        //     depth: 0, //깊이 값(100)
        //     bevelEnabled: true, //베벨링처리 할지말지 여부(true)
        //     bevelThickness: 1.6, //베벨 두께값(6)
        //     bevelSize: 1.5, //모양 외곽선부터 얼마나 멀리 베벨링 할것인지 에 대한 길이(2)
        //     bevelSegments: 6, //베벨링 단계 수(3)
        // };
        // const geometry = new THREE.ExtrudeBufferGeometry(shape, settings); // ExtrudeBufferGeometry 객체 생성

        // const fillMaterial = new THREE.MeshPhongMaterial({color: 0x515151});
        // const cube = new THREE.Mesh(geometry, fillMaterial);

        // const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        // const line = new THREE.LineSegments(
        //     new THREE.WireframeGeometry(geometry), lineMaterial);

        // const group = new THREE.Group();
        // group.add(cube);
        // group.add(line);

        // this._scene.add(group); // scene 객체의 구성요소로 추가됨
        // this._cube = group;

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
        
        camera.position.x = -15;
        camera.position.z = 15;
        this._camera = camera;
    }

    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity); //광원 생성
        light.position.set(-1, 2, 4); // 광원 위치
        this._scene.add(light); // scene 객체 구성요소로 생성
    }

    update(time){
        time *= 0.001; // second unit
        
        /* 오브젝트가 자동으로 돌아가게 하는 코드 */
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
        /**/
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