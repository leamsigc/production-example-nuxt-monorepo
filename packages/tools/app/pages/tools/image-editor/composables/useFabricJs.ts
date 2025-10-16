import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import {
  FabricObject,
  Canvas,
  FabricImage,
  IText,
  Rect,
  Circle,
  Triangle,
  PencilBrush,
  BaseBrush,
  InteractiveFabricObject,
  filters,
  type FabricObjectProps,
  type ITextProps,
} from 'fabric';
import { ca } from 'zod/v4/locales';

// Define a type that extends FabricObject to include a 'name' property
interface FabricObjectWithName extends FabricObject {
  name?: string;
}

type EditorState = 'Init' | 'New' | 'Editing' | 'Export';

const canvas = shallowRef<Canvas | null>(null);
const editorState = ref<EditorState>('Init');
// Local State or use pinia
const activeLayer = ref<FabricObjectWithName | null>(null);
const mainBgColor = ref('#f0f0f0');
const textColor = ref('#000000');
const mainFrameSize = ref<{ width: number; height: number }>({
  width: 800,
  height: 600,
});

const { start, run: imageRun } = useImageTransformer();
export const useFabricJs = () => {
  const run = (elementRef: Ref<HTMLCanvasElement | null>) => {
    onMounted(async () => {
      if (elementRef.value) {
        canvas.value = new Canvas(elementRef.value, {
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          // controlsAboveOverlay: true,
          // enablePointerEvents: true,
          fireRightClick: true,
          targetFindTolerance: 5,
          selectionColor: '#ff0000',
          selectionLineWidth: 2,
        });
        InteractiveFabricObject.ownDefaults = {
          ...InteractiveFabricObject.ownDefaults,
          cornerStyle: 'circle',
          cornerStrokeColor: 'blue',
          cornerColor: 'lightblue',
          padding: 10,
          transparentCorners: false,
          cornerDashArray: [2, 2],
          borderColor: 'orange',
          borderDashArray: [3, 1, 3],
          borderScaleFactor: 2,
        };
        editorState.value = 'New';
        console.log('Fabricjs canvas.value initialized:', canvas.value);
        createChildCanvasAsFrameAndSetActive();
        start(); // Create the initial frame

        await nextTick();
        canvas.value.on('selection:created', () => {
          if (!canvas.value) return;

          const selectedObject = canvas.value.getActiveObject();
          activeLayer.value = selectedObject as FabricObjectWithName;
          // activeObject.value = canvas.value.getActiveObject();
          if (activeLayer.value && selectedObject) {
            selectedObject.set({
              borderColor: '#020420',
              cornerColor: '#00DC82',
              cornerSize: 10,
              transparentCorners: false,
            });
            canvas.value.renderAll();
          }
        });
      }
    });

    onUnmounted(() => {
      if (canvas.value) {
        canvas.value.dispose();
        canvas.value = null;
        console.log('Fabricjs canvas.value disposed.');
      }
    });
  };

  const createChildCanvasAsFrameAndSetActive = () => {
    if (canvas.value) {
      // Remove any existing frame if it has a specific name
      const existingFrame = canvas.value
        .getObjects()
        .find((obj: FabricObjectWithName) => obj.name === 'mainFrame');
      if (existingFrame) {
        canvas.value.remove(existingFrame);
      }

      const frameRect = new Rect({
        left: (canvas.value.width! - mainFrameSize.value.width) / 2,
        top: (canvas.value.height! - mainFrameSize.value.height) / 2,
        width: mainFrameSize.value.width,
        height: mainFrameSize.value.height,
        fill: 'white',
        stroke: '#ccc', // Optional: add a light border for visibility
        strokeWidth: 1,
        selectable: false,
        evented: true,
        name: 'mainFrame', // Unique name for this frame
        hasControls: false,
        hasBorders: true,
      });

      canvas.value.add(frameRect);
      // canvas.value.setActiveObject(frameRect);
      // canvas.value.requestRenderAll();
    }
  };

  const initEditor = () => {
    if (canvas.value) {
      canvas.value.clear();
      editorState.value = 'Init';
    }
  };

  const newEditor = () => {
    if (canvas.value) {
      canvas.value.clear();
      editorState.value = 'New';
    }
  };

  const setEditingState = () => {
    editorState.value = 'Editing';
  };

  const setExportState = () => {
    editorState.value = 'Export';
  };

  const selectLayer = (layer: FabricObject) => {
    if (canvas.value) {
      canvas.value.setActiveObject(layer);
      canvas.value.requestRenderAll();
    }
  };

  const deleteLayer = async (layer?: FabricObject) => {
    if (canvas.value) {
      layer?.canvas?.remove(layer);
      layer?.canvas?.requestRenderAll();
      await nextTick();
    }
  };

  const cropLayer = () => {
    console.log('Crop layer functionality to be implemented.');
  };

  const rotateLayer = (angle: number) => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        activeObject.rotate(activeObject.angle! + angle);
        canvas.value.requestRenderAll();
      }
    }
  };

  const addBrushLayer = (color: string = '#000000', width: number = 5) => {
    if (canvas.value) {
      canvas.value.isDrawingMode = true;
      canvas.value.freeDrawingBrush = new PencilBrush(canvas.value as any); // Cast to any for now
      if (canvas.value.freeDrawingBrush) {
        canvas.value.freeDrawingBrush.color = color;
        canvas.value.freeDrawingBrush.width = width;
      }
      setEditingState();
    }
  };

  const addTextLayer = (text: string = 'New Text', options?: any) => {
    // Using any as a workaround for Fabricjs v6 type issues
    if (canvas.value) {
      const textObject = new IText(text, {
        left: canvas.value.width! / 2,
        top: canvas.value.height! / 2,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#000000',
        ...options,
      });
      canvas.value.add(textObject);
      canvas.value.setActiveObject(textObject);
      canvas.value.requestRenderAll();
      setEditingState();
    }
  };

  const addShapeLayer = (
    type: 'rect' | 'circle' | 'triangle',
    options?: any,
  ) => {
    // Using any as a workaround for Fabricjs v6 type issues
    if (canvas.value) {
      let shape: FabricObject;
      switch (type) {
        case 'rect':
          shape = new Rect({
            left: 50,
            top: 50,
            width: 100,
            height: 100,
            fill: 'red',
            ...options,
          });
          break;
        case 'circle':
          shape = new Circle({
            left: 50,
            top: 50,
            radius: 50,
            fill: 'blue',
            ...options,
          });
          break;
        case 'triangle':
          shape = new Triangle({
            left: 50,
            top: 50,
            width: 100,
            height: 100,
            fill: 'green',
            ...options,
          });
          break;
      }
      canvas.value.add(shape);
      canvas.value.setActiveObject(shape);
      canvas.value.requestRenderAll();
      setEditingState();
    }
  };

  const eraseLayer = (width: number = 10) => {
    if (canvas.value) {
      canvas.value.isDrawingMode = true;
      // Fabricjs v6 uses a different approach for eraser brush.
      // For now, we'll just enable drawing mode.
      // A proper eraser implementation would involve a custom brush or composite operations.
      setEditingState();
    }
  };

  const undo = () => {
    console.log(
      'Undo functionality to be implemented (requires history management).',
    );
  };

  const redo = () => {
    console.log(
      'Redo functionality to be implemented (requires history management).',
    );
  };

  const clearCanvas = () => {
    if (canvas.value) {
      canvas.value.clear();
      editorState.value = 'New';
      canvas.value.requestRenderAll();
    }
  };

  const updateFrameSettings = (settings: {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }) => {
    mainFrameSize.value = {
      width: settings.width || mainFrameSize.value.width,
      height: settings.height || mainFrameSize.value.height,
    };
    if (canvas.value) {
      const frame = canvas.value
        .getObjects()
        .find((obj: FabricObjectWithName) => obj.name === 'mainFrame');
      if (frame) {
        frame.set('width', mainFrameSize.value.width);
        frame.set('height', mainFrameSize.value.height);
        if (settings.fill !== undefined) frame.set('fill', settings.fill);
        if (settings.stroke !== undefined) frame.set('stroke', settings.stroke);
        if (settings.strokeWidth !== undefined)
          frame.set('strokeWidth', settings.strokeWidth);
        canvas.value.centerObject(frame);
        canvas.value.requestRenderAll();
      }
    }
  };

  // Layer settings
  const flipHorizontal = (): void => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        activeObject.set('flipX', !activeObject.flipX);
        canvas.value.requestRenderAll();
      }
    }
  };

  const flipVertical = (): void => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        activeObject.set('flipY', !activeObject.flipY);
        canvas.value.requestRenderAll();
      }
    }
  };

  const rotateLeft = () => rotateLayer(-90);
  const rotateRight = () => rotateLayer(90);

  const arrangeFront = () => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        (canvas.value as any).bringToFront(activeObject); // Type assertion to bypass linter issue with Fabricjs types
        canvas.value.requestRenderAll();
      }
    }
  };

  const arrangeBack = () => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        (canvas.value as any).sendToBack(activeObject); // Type assertion to bypass linter issue with Fabricjs types
        canvas.value.requestRenderAll();
      }
    }
  };

  const setPosition = (x?: number, y?: number) => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        if (x !== undefined) activeObject.set('left', x);
        if (y !== undefined) activeObject.set('top', y);
        canvas.value.requestRenderAll();
      }
    }
  };

  // Layer list
  const getLayers = () => {
    return canvas.value ? canvas.value.getObjects() : [];
  };

  const toggleLayerVisibility = (layer: FabricObject, visible: boolean) => {
    layer.set('visible', visible);
    canvas.value?.requestRenderAll();
  };

  const addImageLayer = async (imageFile: File) => {
    if (canvas.value) {
      const imageUrl = URL.createObjectURL(imageFile);

      const fabricImage = await FabricImage.fromURL(imageUrl);
      if (fabricImage) {
        canvas.value?.add(fabricImage);
        canvas.value?.setActiveObject(fabricImage);
      }
    }
  };

  // Layer adjustments (only if layer is image)
  const applyImageAdjustment = (
    filterType:
      | 'Brightness'
      | 'Contrast'
      | 'Saturation'
      | 'Hue'
      | 'Blur'
      | 'Sharpen'
      | 'Invert',
    value: number,
  ) => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject instanceof FabricImage) {
        let filter:
          | filters.BaseFilter<
            | 'Brightness'
            | 'Contrast'
            | 'Saturation'
            | 'HueRotation'
            | 'Blur'
            | 'Invert'
          >
          | undefined;
        switch (filterType) {
          case 'Brightness':
            filter = new filters.Brightness({ brightness: value });
            break;
          case 'Contrast':
            filter = new filters.Contrast({ contrast: value });
            break;
          case 'Saturation':
            filter = new filters.Saturation({ saturation: value });
            break;
          case 'Hue':
            filter = new filters.HueRotation({ rotation: value });
            break;
          case 'Blur':
            filter = new filters.Blur({ blur: value });
            break;
          case 'Sharpen':
            console.warn(
              'Sharpen filter not directly supported by Fabricjs built-in filters.',
            );
            break;
          case 'Invert':
            filter = new filters.Invert();
            break;
        }
        if (filter) {
          activeObject.filters = activeObject.filters.filter(
            (f) => !(f instanceof (filter as any).constructor),
          );
          activeObject.filters.push(filter);
          activeObject.applyFilters();
          canvas.value.requestRenderAll();
        }
      }
    }
  };

  const applyOpacity = (opacity: number) => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject) {
        activeObject.set('opacity', opacity);
        canvas.value.requestRenderAll();
      }
    }
  };

  const applyPresetFilter = (preset: string) => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject instanceof FabricImage) {
        activeObject.filters = []; // Clear existing filters
        switch (preset) {
          case 'Original':
            break;
          case 'Grayscale':
            activeObject.filters.push(new filters.Grayscale());
            break;
          case 'Sepia':
            activeObject.filters.push(new filters.Sepia());
            break;
          case 'Solarize':
            console.warn(
              'Solarize filter not directly supported by Fabricjs built-in filters.',
            );
            break;
          case 'Posterize':
            console.warn(
              'Posterize filter not directly supported by Fabricjs built-in filters.',
            );
            break;
          case 'Contrast':
            activeObject.filters.push(new filters.Contrast({ contrast: 0.5 }));
            break;
          case 'Brightness':
            activeObject.filters.push(
              new filters.Brightness({ brightness: 0.2 }),
            );
            break;
          case 'vintage':
            console.warn(
              'Vintage filter not directly supported by Fabricjs built-in filters.',
            );
            break;
          case 'Black and white':
            console.warn(
              'Black and white filter not directly supported by Fabricjs built-in filters.',
            );
            break;
          case 'Negative':
            activeObject.filters.push(new filters.Invert());
            break;
          case 'dramatic':
            activeObject.filters.push(new filters.Contrast({ contrast: 0.3 }));
            activeObject.filters.push(
              new filters.Saturation({ saturation: 0.2 }),
            );
            break;
          case 'nature':
            activeObject.filters.push(
              new filters.HueRotation({ rotation: 0.1 }),
            );
            activeObject.filters.push(
              new filters.Saturation({ saturation: 0.15 }),
            );
            break;
        }
        activeObject.applyFilters();
        canvas.value.requestRenderAll();
      }
    }
  };

  const triggerRemoveBackground = () => {
    if (canvas.value) {
      const activeObject = canvas.value.getActiveObject();
      if (activeObject instanceof FabricImage) {
        // Convert the active image to a data URL or Blob to send to the worker
        // For simplicity, we'll get the image element's src if it's already loaded
        // or render it to a temporary canvas.value if it's a complex Fabricjs image.
        // For now, let's assume the image has a src that can be used.
        // A more robust solution would involve rendering the Fabricjs image to a temporary canvas.value.
        const imageElement = activeObject.getElement();
        if (imageElement instanceof HTMLImageElement && imageElement.src) {
          fetch(imageElement.src)
            .then((res) => res.blob())
            .then((blob) => {
              const file = new File([blob], 'image_for_bg_removal.png', {
                type: blob.type,
              });
            })
            .catch((error) =>
              console.error(
                'Error fetching image for background removal:',
                error,
              ),
            );
        } else {
          console.warn(
            'Active object is not a simple image or its source is not directly accessible for background removal.',
          );
          // Fallback: render to a temporary canvas.value
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = activeObject.width!;
          tempCanvas.height = activeObject.height!;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            activeObject.render(tempCtx);
            tempCanvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], 'image_for_bg_removal.png', {
                  type: 'image/png',
                });
                await imageRun(file);
              }
            }, 'image/png');
          }
        }
      } else {
        console.warn('No active image object selected for background removal.');
      }
    } else {
      console.warn('Canvas or background remover worker not initialized.');
    }
  };

  const downloadCanvasImage = (
    format: 'png' | 'jpeg' = 'png',
    quality: number = 1,
  ) => {
    if (canvas.value) {
      // Get the mainFrame layer  then group all layers
      const dataURL = canvas.value.toDataURL({
        format: format,
        quality: quality,
        multiplier: 2, // Increase resolution for better quality download
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `canvas_image.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('Canvas not initialized for download.');
    }
  };

  const updateCanvasDimensions = (width: number, height: number) => {
    if (canvas.value) {
      canvas.value.setDimensions({ width, height });
      canvas.value.requestRenderAll();
      console.log(`Canvas dimensions updated to: ${width}x${height}`);
    } else {
      console.warn('Canvas not initialized.');
    }
  };

  const zoomIn = () => {
    if (canvas.value) {
      canvas.value.setZoom(canvas.value.getZoom() * 1.1);
      canvas.value.requestRenderAll();
    } else {
      console.warn('Canvas not initialized.');
    }
  };
  const zoomOut = () => {
    if (canvas.value) {
      canvas.value.setZoom(canvas.value.getZoom() / 1.1);
      canvas.value.requestRenderAll();
    } else {
      console.warn('Canvas not initialized.');
    }
  };

  return {
    canvas,
    editorState,
    run,
    initEditor,
    newEditor,
    setEditingState,
    setExportState,
    selectLayer,
    deleteLayer,
    cropLayer,
    rotateLayer,
    addBrushLayer,
    addTextLayer,
    addShapeLayer,
    eraseLayer,
    undo,
    redo,
    clearCanvas,
    updateFrameSettings,
    flipHorizontal,
    flipVertical,
    rotateLeft,
    rotateRight,
    arrangeFront,
    arrangeBack,
    setPosition,
    getLayers,
    toggleLayerVisibility,
    addImageLayer,
    applyImageAdjustment,
    applyOpacity,
    applyPresetFilter,
    triggerRemoveBackground,
    downloadCanvasImage,
    updateCanvasDimensions,
    zoomIn,
    zoomOut,
  };
};
