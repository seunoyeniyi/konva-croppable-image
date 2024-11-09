/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable prefer-const */
"use client";
import Konva from "konva";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Image, Transformer, Group, Rect } from "react-konva";
import { Portal } from "react-konva-utils";

// IMAGE FORMAT
// const image = {
//     type: "image",
//     image: CanvasImageSource,
//     group: undefined,
//     original: {
//       width: 712,
//       height: 585
//     },
//     x: 150,
//     y: 50,
//     width: 200,
//     height: 164,
//     cropBackground: {
//       x: 150,
//       y: 50,
//       width: 200,
//       height: 164,
//     },
//     crop: {
//       x: 0,
//       y: 0,
//       width: 200 * (712 / 200),
//       height: 164 * (585 / 164),
//     },
//   };

type CroppableImageProps = {
  image: CanvasImageSource;
  group?: any;
  original: any;
  x: number;
  y: number;
  width: number;
  height: number;
  cropBackground?: any;
  crop?: any;
  selected?: boolean;
  cropMode?: boolean;
  onClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onDblClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onBgClick?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onChange?: (attrs: any) => void;
  [key: string]: any;
};

export default function CroppableImage({
  image,
  group,
  original,
  x,
  y,
  width,
  height,
  cropBackground,
  crop,
  selected,
  cropMode,
  onClick,
  onDblClick,
  onBgClick,
  onChange,
  ...props
}: CroppableImageProps) {
  const groupRef = React.useRef() as React.MutableRefObject<Konva.Group>;
  const groupTrRef =
    React.useRef() as React.MutableRefObject<Konva.Transformer>;

  // background image (the real dimensions) - shown during crop mode
  const imageBackRef = React.useRef() as React.MutableRefObject<Konva.Image>;
  const imageBackTrRef =
    React.useRef() as React.MutableRefObject<Konva.Transformer>;

  // crop image (the one that is dragged and resized) - always shown
  const cropRef = React.useRef() as React.MutableRefObject<Konva.Image>;
  const cropTrRef = React.useRef() as React.MutableRefObject<Konva.Transformer>;

  const [imageObj, setImageObj] = useState(image);


  const [orginalSourceImage, setOrginalSourceImage] = useState<{
    width: number;
    height: number;
  }>({
    width: original.width,
    height: original.height,
  });

  const [imageBackData, setImageBackData] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>({
    width: cropBackground?.width || width,
    height: cropBackground?.height || height,
    x: cropBackground?.x || x,
    y: cropBackground?.y || y,
  } as any);

  const [cropperData, setCropperData] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>({
    width: width,
    height: height,
    x: x,
    y: y,
  } as any);
  //crop scale btw the originalSourceImage and the imageBackData
  const [cropScale, setCropScale] = useState<{
    x: number;
    y: number;
  }>({
    x: orginalSourceImage.width / imageBackData.width,
    y: orginalSourceImage.height / imageBackData.height,
  });
  const [cropData, setCropData] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: crop?.x || 0,
    y: crop?.y || 0,
    width: crop?.width || width * cropScale.x,
    height: crop?.height || height * cropScale.y,
  } as any);

  const [groupData, setGroupData] = useState<{
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
  }>({
    ...group,
    x: group?.x,
    y: group?.y,
    scaleX: group?.scaleX,
    scaleY: group?.scaleY,
  } as any);

  //   on any props change, update the state
  useEffect(() => {

    setImageObj(image);

    const newOrginalSourceImage = {
      width: original.width,
      height: original.height,
    };
    setOrginalSourceImage(newOrginalSourceImage);

    const newImageBackData = {
      width: cropBackground?.width || width,
      height: cropBackground?.height || height,
      x: cropBackground?.x || x,
      y: cropBackground?.y || y,
    };
    setImageBackData(newImageBackData);

    const newCropperData = {
      width: width,
      height: height,
      x: x,
      y: y,
    };
    setCropperData(newCropperData);

    const newCropScale = {
      x: newOrginalSourceImage.width / newImageBackData.width,
      y: newOrginalSourceImage.height / newImageBackData.height,
    };
    setCropScale(newCropScale);

    const newCropData = {
      x: crop?.x || 0,
      y: crop?.y || 0,
      width: crop?.width || width * newCropScale.x,
      height: crop?.height || height * newCropScale.y,
    };
    setCropData(newCropData);

    const newGroupData = {
      ...group,
      x: group?.x,
      y: group?.y,
      scaleX: group?.scaleX,
      scaleY: group?.scaleY,
    };
    setGroupData(newGroupData);
  }, [image, original, width, height, x, y, cropBackground, crop, group]);

  useEffect(() => {
    if (selected) {
      groupTrRef.current?.nodes([groupRef.current]);
      groupTrRef.current?.getLayer()?.batchDraw();
    }
    if (cropMode) {
      cropTrRef.current?.nodes([cropRef.current]);
      cropTrRef.current?.getLayer()?.batchDraw();
      imageBackTrRef.current?.nodes([imageBackRef.current]);
      imageBackTrRef.current?.getLayer()?.batchDraw();
    }
  }, [selected, cropMode]);

  const onShapeTransform = (e: any) => {
    const node = imageBackRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);

    setImageBackData({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });

    setCropScale({
      x: orginalSourceImage.width / node.width(),
      y: orginalSourceImage.height / node.height(),
    });

    setCropData({
      x: (cropRef.current.x() - node.x()) * cropScale.x,
      y: (cropRef.current.y() - node.y()) * cropScale.y,
      width: cropRef.current.width() * cropScale.x,
      height: cropRef.current.height() * cropScale.y,
    });
  };

  const onShapeDragMove = (e: any) => {
    const node = imageBackRef.current;
    setImageBackData({
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
    });

    setCropData({
      x: (cropRef.current.x() - node.x()) * cropScale.x,
      y: (cropRef.current.y() - node.y()) * cropScale.y,
      width: cropRef.current.width() * cropScale.x,
      height: cropRef.current.height() * cropScale.y,
    });
  };

  const onCropTransform = (e: any) => {
    const node = cropRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);

    setCropperData({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
    });

    setCropData({
      x: (node.x() - imageBackData.x) * cropScale.x,
      y: (node.y() - imageBackData.y) * cropScale.y,
      width: Math.max(5, node.width() * scaleX * cropScale.x),
      height: Math.max(5, node.height() * scaleY * cropScale.y),
    });
  };

  const onCropDragMove = (e: any) => {
    const node = cropRef.current;

    setCropperData({
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
    });

    setCropData({
      x: (node.x() - imageBackData.x) * cropScale.x,
      y: (node.y() - imageBackData.y) * cropScale.y,
      width: node.width() * cropScale.x,
      height: node.height() * cropScale.y,
    });
  };

  const onGroupTransform = (e: any) => {
    const groupNode = groupRef.current;
    const x = groupNode.x();
    const y = groupNode.y();
    const scaleX = groupNode.scaleX();
    const scaleY = groupNode.scaleY();

    setGroupData({
      ...groupNode.attrs,
      x: x,
      y: y,
      scaleX: scaleX,
      scaleY: scaleY,
    });
  };

  const onGroupDrag = (e: any) => {
    const groupNode = groupRef.current;
    const x = groupNode.x();
    const y = groupNode.y();
    const scaleX = groupNode.scaleX();
    const scaleY = groupNode.scaleY();

    setGroupData({
      ...groupNode.attrs,
      x: x,
      y: y,
      scaleX: scaleX,
      scaleY: scaleY,
    });
  };

  // end actions
  const onGroupTransformEnd = (e: any) => {
    endChange();
  };
  const onGroupDragEnd = (e: any) => {
    endChange();
  };
  const onCropDragEnd = (e: any) => {
    endChange();
  };
  const onCropTransformEnd = (e: any) => {
    endChange();
  };

  //callback to parent onChange
  const endChange = () => {
    //send all changes to parent
    onChange?.({
      ...props,
      //image
      image: image,
      //group
      group: groupData,
      //original
      original: orginalSourceImage,
      //x,y,width,height
      x: cropperData.x,
      y: cropperData.y,
      width: cropperData.width,
      height: cropperData.height,
      //cropBackground
      cropBackground: imageBackData,
      //crop
      crop: cropData,
    });
  };

  const onBackgroundClick = (e: any) => {
    onBgClick?.(e);
    endChange();
  };

  const onGroupClick = (e: any) => {
    if (!cropMode) {
      onClick?.(e);
    }
  };

  const onGroupDblClick = (e: any) => {
    onDblClick?.(e);
  };

  return (
    <>
      <React.Fragment>
        <Portal enabled={cropMode} selector=".top-layer">
        <Group
          {...groupData}
          ref={groupRef}
          x={groupData.x}
          y={groupData.y}
          scaleX={groupData.scaleX}
          scaleY={groupData.scaleY}
          draggable={true}
          listening={true}
          onTransform={onGroupTransform}
          onDragMove={onGroupDrag}
          onTransformEnd={onGroupTransformEnd}
          onDragEnd={onGroupDragEnd}
          onClick={onGroupClick}
          onTap={onGroupClick}
          onDblClick={onGroupDblClick}
          onDblTap={onGroupDblClick}
        >
          {/* Background Image */}
          {cropMode && (
            <>
              <Image
                {...props}
                image={imageObj}
                ref={imageBackRef}
                x={imageBackData.x}
                y={imageBackData.y}
                width={imageBackData.width}
                height={imageBackData.height}
                scaleX={1}
                scaleY={1}
                draggable={cropMode}
                onTransform={onShapeTransform}
                onDragMove={onShapeDragMove}
                onClick={onBackgroundClick}
                onTap={onBackgroundClick}
                perfectDrawEnabled={Boolean(props.perfectDrawEnabled ?? false)}
              />
              {/* overlay rect */}
              <Rect
                x={-10000}
                y={-10000}
                width={20000}
                height={20000}
                fill="rgba(0,0,0,0.5)"
                listening={false}
              />
            </>
          )}

          {/* Crop Image */}
          <Image
            {...props}
            image={imageObj}
            ref={cropRef}
            x={cropperData.x}
            y={cropperData.y}
            width={cropperData.width}
            height={cropperData.height}
            crop={cropData}
            scaleX={1}
            scaleY={1}
            draggable={cropMode}
            onTransform={onCropTransform}
            onTransformEnd={onCropTransformEnd}
            onDragMove={onCropDragMove}
            onDragEnd={onCropDragEnd}
            perfectDrawEnabled={Boolean(props.perfectDrawEnabled ?? false)}
          />

          {/* Transformer for Background Image */}
          {cropMode && (
            <Transformer
              ref={imageBackTrRef}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              rotateEnabled={false}
              anchorCornerRadius={50}
              anchorSize={20}
            />
          )}
          {/* Transformer for Crop Image */}
          {cropMode && (
            <Transformer
              ref={cropTrRef}
              draggable={true}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }

                return newBox;
              }}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              rotateEnabled={false}
              anchorCornerRadius={0}
              anchorSize={10}
              keepRatio={false}
            />
          )}
        </Group>

        {/* Transformer for Group */}
        {selected && !cropMode && (
          <Transformer
            ref={groupTrRef}
            flipEnabled={true}
            rotateEnabled={true}
            resizeEnabled={true}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            anchorStyleFunc={(anchor: any) => {
              anchor.cornerRadius(10);
              if (
                anchor.hasName("top-center") ||
                anchor.hasName("bottom-center")
              ) {
                anchor.height(6);
                anchor.offsetY(3);
                anchor.width(26);
                anchor.offsetX(13);
              } else if (
                anchor.hasName("middle-left") ||
                anchor.hasName("middle-right")
              ) {
                anchor.height(26);
                anchor.offsetY(13);
                anchor.width(6);
                anchor.offsetX(3);
              } else if (anchor.hasName("rotater")) {
                anchor.cornerRadius(15);
                anchor.width(26);
                anchor.height(26);
                anchor.offsetX(13);
                anchor.offsetY(13);
              } else {
                anchor.width(14);
                anchor.offsetX(8);
                anchor.height(14);
                anchor.offsetY(8);
              }
            }}
          />
        )}
        </Portal>
      </React.Fragment>
    </>
  );
}
