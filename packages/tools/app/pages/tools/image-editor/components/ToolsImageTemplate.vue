<script lang="ts" setup>
import { useFabricJs } from '../composables/useFabricJs';

/**
 *
 * Component Description:Modal content for image templates.
 *
 * @author Ismael Garcia <leamsigc@leamsigc.com>
 * @version 0.0.1
 *>
 * @todo [ ] Test the component
 * @todo [ ] Integration test.
 * @todo [✔] Update the typescript.
 */
const { loadTemplateFromJson } = useFabricJs();
const json = `
{
    "version": "6.7.1",
    "objects": [
        {
            "rx": 0,
            "ry": 0,
            "type": "Rect",
            "version": "6.7.1",
            "originX": "left",
            "originY": "top",
            "left": -444.11,
            "top": -349.25,
            "width": 800,
            "height": 600,
            "fill": "white",
            "stroke": "#ccc",
            "strokeWidth": 1,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeUniform": false,
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "skewX": 0,
            "skewY": 0
        },
        {
            "subTargetCheck": false,
            "interactive": false,
            "type": "Group",
            "version": "6.7.1",
            "originX": "left",
            "originY": "top",
            "left": 385.22,
            "top": 182.5,
            "width": 1680,
            "height": 965,
            "fill": "rgb(0,0,0)",
            "stroke": null,
            "strokeWidth": 0,
            "strokeDashArray": null,
            "strokeLineCap": "butt",
            "strokeDashOffset": 0,
            "strokeLineJoin": "miter",
            "strokeUniform": false,
            "strokeMiterLimit": 4,
            "scaleX": 1,
            "scaleY": 1,
            "angle": 0,
            "flipX": false,
            "flipY": false,
            "opacity": 1,
            "shadow": null,
            "visible": true,
            "backgroundColor": "",
            "fillRule": "nonzero",
            "paintFirst": "fill",
            "globalCompositeOperation": "source-over",
            "skewX": 0,
            "skewY": 0,
            "clipPath": {
                "rx": 0,
                "ry": 0,
                "inverted": false,
                "absolutePositioned": false,
                "type": "Rect",
                "version": "6.7.1",
                "originX": "left",
                "originY": "top",
                "left": 0,
                "top": 0,
                "width": 800,
                "height": 600,
                "fill": "rgb(0,0,0)",
                "stroke": null,
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeUniform": false,
                "strokeMiterLimit": 4,
                "scaleX": 1,
                "scaleY": 1,
                "angle": 0,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "backgroundColor": "",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "skewX": 0,
                "skewY": 0
            },
            "layoutManager": {
                "type": "layoutManager",
                "strategy": "fit-content"
            },
            "objects": [
                {
                    "rx": 0,
                    "ry": 0,
                    "type": "Rect",
                    "version": "6.7.1",
                    "originX": "left",
                    "originY": "top",
                    "left": -444.11,
                    "top": -349.25,
                    "width": 800,
                    "height": 600,
                    "fill": "white",
                    "stroke": "#ccc",
                    "strokeWidth": 1,
                    "strokeDashArray": null,
                    "strokeLineCap": "butt",
                    "strokeDashOffset": 0,
                    "strokeLineJoin": "miter",
                    "strokeUniform": false,
                    "strokeMiterLimit": 4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "angle": 0,
                    "flipX": false,
                    "flipY": false,
                    "opacity": 1,
                    "shadow": null,
                    "visible": true,
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "skewX": 0,
                    "skewY": 0
                },
                {
                    "cropX": 0,
                    "cropY": 0,
                    "type": "Image",
                    "version": "6.7.1",
                    "originX": "left",
                    "originY": "top",
                    "left": -498.89,
                    "top": -197.97,
                    "width": 1920,
                    "height": 1053,
                    "fill": "rgb(0,0,0)",
                    "stroke": null,
                    "strokeWidth": 0,
                    "strokeDashArray": null,
                    "strokeLineCap": "butt",
                    "strokeDashOffset": 0,
                    "strokeLineJoin": "miter",
                    "strokeUniform": false,
                    "strokeMiterLimit": 4,
                    "scaleX": 0.5197,
                    "scaleY": 0.5197,
                    "angle": 0,
                    "flipX": false,
                    "flipY": false,
                    "opacity": 1,
                    "shadow": null,
                    "visible": true,
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "skewX": 0,
                    "skewY": 0,
                    "src": "http://localhost:3000/ee74b463-ec36-4f53-a3b8-37b1598f1179",
                    "crossOrigin": null,
                    "filters": []
                },
                {
                    "fontSize": 36,
                    "fontWeight": "bold",
                    "fontFamily": "Arial",
                    "fontStyle": "normal",
                    "lineHeight": 1.16,
                    "text": "Heading 2",
                    "charSpacing": 0,
                    "textAlign": "left",
                    "styles": [],
                    "pathStartOffset": 0,
                    "pathSide": "left",
                    "pathAlign": "baseline",
                    "underline": false,
                    "overline": false,
                    "linethrough": false,
                    "textBackgroundColor": "",
                    "direction": "ltr",
                    "textDecorationThickness": 66.667,
                    "type": "IText",
                    "version": "6.7.1",
                    "originX": "left",
                    "originY": "top",
                    "left": -187.11,
                    "top": -267.25,
                    "width": 172.038,
                    "height": 40.68,
                    "fill": "#000000",
                    "stroke": null,
                    "strokeWidth": 1,
                    "strokeDashArray": null,
                    "strokeLineCap": "butt",
                    "strokeDashOffset": 0,
                    "strokeLineJoin": "miter",
                    "strokeUniform": false,
                    "strokeMiterLimit": 4,
                    "scaleX": 1,
                    "scaleY": 1,
                    "angle": 0,
                    "flipX": false,
                    "flipY": false,
                    "opacity": 1,
                    "shadow": null,
                    "visible": true,
                    "backgroundColor": "",
                    "fillRule": "nonzero",
                    "paintFirst": "fill",
                    "globalCompositeOperation": "source-over",
                    "skewX": 0,
                    "skewY": 0
                }
            ]
        }
    ],
    "background": "rgba(0, 0, 0, 0.1)"
}`;
const loadTemplate = () => {
  loadTemplateFromJson(json);
};
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Image Templates</h3>
    </template>
    <section class="grid grid-cols-2 gap-4">
      <UPageCard title="Template 1" description="A simple template for social media posts." icon="i-heroicons-photo"
        @click="loadTemplate" />
      <UPageCard title="Template 2" description="A template with a modern design." icon="i-heroicons-photo" />
      <UPageCard title="Template 3" description="A template for blog post headers." icon="i-heroicons-photo" />
    </section>
    <template #footer>
      <UButton color="primary" variant="solid">Load Template</UButton>
    </template>
  </UCard>
</template>
<style scoped></style>
