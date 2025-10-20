import { Canvas, FabricObject, IText, Rect, Circle, Triangle, PencilBrush, FabricImage, filters, Group, Point } from 'fabric';
import { BaseFabricPlugin, FabricEditor, type FabricObjectWithName } from './FabricEditor';
import { nextTick } from 'vue';
import { CorePlugin } from './CorePlugin';

export class ToolsPlugin extends BaseFabricPlugin {
  static readonly pluginName = 'tools';
  readonly pluginName = 'tools'; // Instance property

  protected init() {
    // No specific initialization needed for the plugin itself, methods are called on demand
  }

  // Layer management
  selectLayer() {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.canvas.requestRenderAll();
    }
  }

  setActiveLayer(layer: FabricObject) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.canvas.setActiveObject(layer);
      this.canvas.requestRenderAll();
    }
  }

  async deleteLayer(layer?: FabricObject) {
    if (this.canvas) {
      layer?.canvas?.remove(layer);
      layer?.canvas?.requestRenderAll();
      await nextTick();
    }
  }

  cropLayer() {
    console.log('Crop layer functionality to be implemented.');
  }

  rotateLayer(angle: number) {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.rotate(activeObject.angle! + angle);
        this.canvas.requestRenderAll();
      }
    }
  }

  addBrushLayer(color: string = '#000000', width: number = 5) {
    if (this.canvas) {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new PencilBrush(this.canvas as any);
      if (this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.color = color;
        this.canvas.freeDrawingBrush.width = width;
      }
      this.editor.state.value = 'Editing';
    }
  }

  addTextLayer(text: string = 'New Text', options?: any) {
    if (this.canvas) {
      const textObject = new IText(text, {
        left: this.canvas.width! / 2,
        top: this.canvas.height! / 2,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#000000',
        ...options,
      });
      this.canvas.add(textObject);
      this.canvas.setActiveObject(textObject);
      this.canvas.requestRenderAll();
      this.editor.state.value = 'Editing';
    }
  }

  addShapeLayer(
    type: 'rect' | 'circle' | 'triangle',
    options?: any,
  ) {
    if (this.canvas) {
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
      this.canvas.add(shape);
      this.canvas.setActiveObject(shape);
      this.canvas.requestRenderAll();
      this.editor.state.value = 'Editing';
    }
  }

  eraseLayer(width: number = 10) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      // Fabricjs v6 uses a different approach for eraser brush.
      // For now, we'll just enable drawing mode.
      // A proper eraser implementation would involve a custom brush or composite operations.
      this.editor.state.value = 'Editing';
    }
  }

  clearCanvas() {
    if (this.canvas) {
      this.canvas.clear();
      this.editor.state.value = 'New';
      this.canvas.requestRenderAll();
    }
  }

  updateFrameSettings(settings: {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }) {
    this.editor.globalSettings.value = {
      width: settings.width || this.editor.globalSettings.value.width,
      height: settings.height || this.editor.globalSettings.value.height,
      fill: settings.fill || this.editor.globalSettings.value.fill,
      stroke: settings.stroke || this.editor.globalSettings.value.stroke,
      strokeWidth: settings.strokeWidth || this.editor.globalSettings.value.strokeWidth,
    };
    this.editor.mainFrameSize.value = {
      width: this.editor.globalSettings.value.width || this.editor.mainFrameSize.value.width,
      height: this.editor.globalSettings.value.height || this.editor.mainFrameSize.value.height,
    };
    if (this.canvas) {
      const frame = this.canvas
        .getObjects()
        .find((obj: FabricObjectWithName) => obj.id === 'workspace');
      if (frame) {
        frame.set('width', this.editor.globalSettings.value.width);
        frame.set('height', this.editor.globalSettings.value.height);
        if (settings.fill !== undefined) frame.set('fill', this.editor.globalSettings.value.fill);
        if (settings.stroke !== undefined) frame.set('stroke', this.editor.globalSettings.value.stroke);
        if (settings.strokeWidth !== undefined)
          frame.set('strokeWidth', this.editor.globalSettings.value.strokeWidth);
        this.canvas.centerObject(frame);
        this.canvas.requestRenderAll();
      }
    }
  }

  flipHorizontal(): void {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.set('flipX', !activeObject.flipX);
        this.canvas.requestRenderAll();
      }
    }
  }

  flipVertical(): void {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.set('flipY', !activeObject.flipY);
        this.canvas.requestRenderAll();
      }
    }
  }

  rotateLeft = () => this.rotateLayer(-90);
  rotateRight = () => this.rotateLayer(90);

  arrangeFront() {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        (this.canvas as any).bringToFront(activeObject);
        this.canvas.requestRenderAll();
      }
    }
  }

  arrangeBack() {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        (this.canvas as any).sendToBack(activeObject);
        this.canvas.requestRenderAll();
      }
    }
  }

  setPosition(x?: number, y?: number) {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        if (x !== undefined) activeObject.set('left', x);
        if (y !== undefined) activeObject.set('top', y);
        this.canvas.requestRenderAll();
      }
    }
  }

  getLayers() {
    return this.canvas ? this.canvas.getObjects() : [];
  }

  toggleLayerVisibility(layer: FabricObject, visible: boolean) {
    layer.set('visible', visible);
    this.canvas?.requestRenderAll();
  }

  async addImageLayerFromUrl(url: string) {
    if (this.canvas) {
      const fabricImage = await FabricImage.fromURL(url);
      if (fabricImage) {
        this.canvas?.add(fabricImage);
        this.canvas?.setActiveObject(fabricImage);
      }
    }
  }

  async addImageLayer(imageFile: File) {
    if (this.canvas) {
      const imageUrl = URL.createObjectURL(imageFile);
      this.addImageLayerFromUrl(imageUrl);
    }
  }

  applyImageAdjustment(
    filterType:
      | 'Brightness'
      | 'Contrast'
      | 'Saturation'
      | 'Hue'
      | 'Blur'
      | 'Sharpen'
      | 'Invert',
    value: number,
  ) {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
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
          this.canvas.requestRenderAll();
        }
      }
    }
  }

  applyOpacity(opacity: number) {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        activeObject.set('opacity', opacity);
        this.canvas.requestRenderAll();
      }
    }
  }

  applyPresetFilter(preset: string) {
    if (this.canvas) {
      const activeObject = this.canvas.getActiveObject();
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
        this.canvas.requestRenderAll();
      }
    }
  }

  downloadCanvasImage(
    format: 'png' | 'jpeg' = 'png',
    quality: number = 1,
  ) {
    if (this.canvas) {
      const frame = this.canvas
        .getObjects()
        .find((obj: FabricObjectWithName) => obj.id === 'workspace');
      if (!frame) {
        console.warn('Main frame not found for download.');
        return;
      }
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataURL = this.canvas.toDataURL({
        format,
        quality,
        multiplier: 1,
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
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
  }

  updateCanvasDimensions(width: number, height: number) {
    if (this.canvas) {
      this.canvas.setDimensions({ width, height });
      this.canvas.requestRenderAll();
      console.log(`Canvas dimensions updated to: ${width}x${height}`);
    } else {
      console.warn('Canvas not initialized.');
    }
  }

  zoomIn() {
    if (this.canvas) {
      this.canvas.setZoom(this.canvas.getZoom() * 1.1);
      this.canvas.requestRenderAll();
    } else {
      console.warn('Canvas not initialized.');
    }
  }

  zoomOut() {
    if (this.canvas) {
      this.canvas.setZoom(this.canvas.getZoom() / 1.1);
      this.canvas.requestRenderAll();
    } else {
      console.warn('Canvas not initialized.');
    }
  }

  async loadTemplateFromJson(json: string) {
    if (this.canvas) {
      await this.canvas.loadFromJSON(json, () => {
        this.canvas?.requestRenderAll();
      });
      const currentMainFrame = this.canvas
        ?.getObjects()
        .find((obj: FabricObjectWithName) => obj.id === 'workspace');
      if (currentMainFrame) {
        this.canvas?.centerObject(currentMainFrame);
        this.canvas?.requestRenderAll();
      } else {
        console.log("No mainframe");
        // Re-create frame if not found in loaded JSON
        const corePlugin = this.editor.getPlugin('core') as CorePlugin;
        if (corePlugin && corePlugin.onCanvasInit) {
          corePlugin.onCanvasInit(this.canvas);
        }
      }
    } else {
      console.warn('Canvas not initialized.');
    }
  }

  exportCurrentCanvas() {
    if (this.canvas) {
      const groupLayer = this.groupLayers();
      // @ts-ignore
      groupLayer.id = 'workspace';
      this.canvas.add(groupLayer);

      if (!groupLayer) {
        console.warn('Group layer not found.');
        return;
      }
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const json = this.canvas.toObject(['id',
        'gradientAngle',
        'selectable',
        'hasControls',
        'linkData',
        'editable',
        'extensionType',
        'extension',
        'verticalAlign',
        'roundValue',]);
      const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(json, null, '\t')
      )}`;

      this.downFile(fileStr, 'json');
      this.canvas?.add(groupLayer);

      this.canvas?.requestRenderAll();
    } else {
      console.warn('Canvas not initialized.');
    }
  }

  downFile(fileStr: string, fileType: string) {
    const anchorEl = document.createElement('a');
    anchorEl.href = fileStr;
    anchorEl.download = `${Date.now()}.${fileType}`;
    document.body.appendChild(anchorEl); // required for firefox
    anchorEl.click();
    anchorEl.remove();
  }

  groupLayers() {
    const otherLayers = this.canvas
      ?.getObjects()
      .filter((obj: FabricObjectWithName) => obj.id !== 'workspace');
    const layers = otherLayers ? otherLayers : [];
    const mainLayer = this.canvas
      ?.getObjects()
      .find((obj: FabricObjectWithName) => obj.id === 'workspace');
    if (mainLayer) layers.unshift(mainLayer);

    const group = new Group(layers);
    group.clipPath = mainLayer?.clipPath;

    this.canvas?.getObjects().forEach((obj: FabricObjectWithName) => {
      if (obj.id !== 'workspace') {
        this.canvas?.remove(obj);
      }
    });

    return group;
  }

  center(layer: FabricObjectWithName) {
    this.canvas?.centerObject(layer);
    this.canvas?.requestRenderAll();
  }
}
