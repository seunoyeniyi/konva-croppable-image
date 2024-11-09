// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable prefer-const */
// "use client";
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useRef, useState } from "react";
// import { Stage, Layer, Rect } from "react-konva";
// import useImage from "use-image";
// import CroppableImage from "konva-croppable-image";

// export default function LearnKonvaImageCropping() {
//   // "/images/collections-hero23.png"
//   const stageRef = useRef(null as any);
//   const [showStage, setShowStage] = useState(true);
//   const [canvasSize, setCanvasSize] = useState({
//     width: 500,
//     height: 500,
//   });
//   const [stageScale, setStageScale] = useState({
//     x: 1,
//     y: 1,
//   });

//   const [image, setImage] = useState({
//     type: "image",
//     // src: `/images/collections-hero23.png`,
//     group: undefined,
//     x: 150,
//     y: 50,
//     width: 200,
//     height: 164,
//     original: {
//       width: 712,
//       height: 585,
//     },
//     // circlar avatar
//     cornerRadius: 200,
//   } as any);

//   const [img, status] = useImage(`/images/collections-hero23.png`);
  
  

//   const [selected, setSelected] = useState(false);
//   const [cropMode, setCropMode] = useState(false); //crop mode

//   return (
//     <>
//       <div className="h-screen flex flex-col items-center justify-center w-full">
//         <div className="flex items-center justify-center gap-x-2 space-x-2">
//           <button
//             onClick={() => setShowStage(!showStage)}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Toggle Stage
//           </button>
//           {/* export to json */}
//           <button
//             onClick={() => {
//               const json = stageRef.current.toJSON();
//               console.log(json);
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Export JSON
//           </button>
//         </div>
//         {showStage && (
//           <Stage
//             width={canvasSize.width}
//             height={canvasSize.height}
//             scaleX={stageScale.x}
//             scaleY={stageScale.y}
//             ref={stageRef}
//             className="bg-white border-2 border-gray-600"
//             onMousedown={(e: any) => {
//               //deselect
//               if (e.target === e.target.getStage()) {
//                 setSelected(false);
//                 setCropMode(false);
//               }
//             }}
//           >
//             <Layer>
//               <CroppableImage
//                 {...image}
//                 image={img}
//                 group={image.group}
//                 original={image.original}
//                 x={image.x}
//                 y={image.y}
//                 width={image.width}
//                 height={image.height}
//                 cropBackground={image.cropBackground}
//                 crop={image.crop}
//                 selected={selected}
//                 cropMode={cropMode}
//                 onClick={() => {
//                   setSelected(true);
//                 }}
//                 onDblClick={() => {
//                   setCropMode(true);
//                 }}
//                 onBgClick={(attrs: any) => {
//                   setImage({ ...image, ...attrs });
//                   setCropMode(false);
//                 }}
//                 onChange={(attrs: any) => {
//                   setImage({ ...image, ...attrs });
//                 }}
//               />
//               <Rect x={0} y={0} width={200} height={200} fill="red" />
//             </Layer>
//             {/* Portal for shape dragging, cropping etc */}
//             <Layer name="top-layer" />
//           </Stage>
//         )}
//       </div>
//     </>
//   );
// }
