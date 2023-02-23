let detector;
let poses;
let video;
// const img = new Image();
// img.src = "squat.PNG";
//const img = document.getElementById("my-img");
// console.log(img);
let index = 0;
let leftkneex;
let leftkneey;
let leftfootx;
let imgr;
let imgg;
let right;
let wrong;

function preload() {
  // preload() runs once
  imgr = loadImage('squat_outline_r.png');
  imgg = loadImage('squat_outline_g.png');
    right = loadImage('right.png');
    wrong = loadImage('wrong.png');

}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.PoseNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function setup() {
  frameRate(60);
 //print("fr is "+frameRate());
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  // video.size(320, 240);
  video.hide();
  await init();
  imgr.resize(640,480);
  imgg.resize(640,480);
  right.resize(50,50);
  wrong.resize(50,50);
  //console.log(img);
//await getPoses();
  // createButton('pose').mousePressed(getPoses);
}

async function getPoses() {
  poses = await detector.estimatePoses(video.elt);
  //console.log(poses);
  requestAnimationFrame(getPoses);
}

function draw() {
   //print("frco"+frameRate());

  background(220,0.5);
  image(video, 0, 0);
    image(imgg, 0, 0);

  if (poses && poses.length > 0) {
    index=0;

    for (let kp of poses[0].keypoints) {
      const { x, y, score } = kp;
      if (score > 0.5) {
        //console.log(index);
        
        //if y coordinate diff between left knee and left foot is less than 100, you are wrong!
        
        //left knee
        if (index == 13){
          leftkneex=x;
          leftkneey=y;
          //fill("red");
          console.log("coordinate for left knee is: "+x+" "+y);
        circle(x, y, 16);
        } else if(index==14){
          //fill("green");
            console.log("coordinate for right knee is: "+x+" "+y);
        circle(x, y, 16);
        } else if (index==15){
          leftfootx=x;

          //fill("blue");
      console.log("coordinate for left foot is: "+x+" "+y);
        circle(x, y, 16);
        } else if (index==16){
           //fill(0);
      console.log("coordinate for right foot is: "+x+" "+y);
        circle(x, y, 16);
        } else{
        fill(255);

        circle(x, y, 16);
        }
        if (leftkneex - leftfootx > 40){
          image(imgr,0,0);
          image(wrong,leftkneex,leftkneey);
        } else {
           image(right,leftkneex,leftkneey);
        }
      }
      index++;
    }
  }
}
