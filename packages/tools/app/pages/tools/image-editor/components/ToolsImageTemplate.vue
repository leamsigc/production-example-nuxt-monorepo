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
			"selectable": false,
			"hasControls": false,
			"type": "Rect",
			"version": "6.7.1",
			"originX": "left",
			"originY": "top",
			"left": -630.4375,
			"top": -830.5,
			"width": 1242,
			"height": 1660,
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
			"skewY": 0,
      "name":"mainFrame"
		},
		{
			"subTargetCheck": false,
			"interactive": false,
			"selectable": true,
			"hasControls": true,
			"type": "Group",
			"version": "6.7.1",
			"originX": "left",
			"originY": "top",
			"left": 394,
			"top": 150,
			"width": 1672.875,
			"height": 1661,
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
			"layoutManager": {
				"type": "layoutManager",
				"strategy": "fit-content"
			},
			"objects": [
				{
					"rx": 0,
					"ry": 0,
					"selectable": false,
					"hasControls": false,
					"type": "Rect",
					"version": "6.7.1",
					"originX": "left",
					"originY": "top",
					"left": -630.4375,
					"top": -830.5,
					"width": 1242,
					"height": 1660,
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
					"selectable": true,
					"hasControls": true,
					"type": "Image",
					"version": "6.7.1",
					"originX": "left",
					"originY": "top",
					"left": -836.4375,
					"top": -548.5,
					"width": 1152,
					"height": 896,
					"fill": "rgb(0,0,0)",
					"stroke": null,
					"strokeWidth": 0,
					"strokeDashArray": null,
					"strokeLineCap": "butt",
					"strokeDashOffset": 0,
					"strokeLineJoin": "miter",
					"strokeUniform": false,
					"strokeMiterLimit": 4,
					"scaleX": 1.4521,
					"scaleY": 1.4521,
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
					"src": "http://localhost:3000/api/v1/assets/serve/9038e4b3-1208-4438-964c-951113e927d5.png",
					"crossOrigin": null,
					"filters": []
				}
			]
		}
	],
	"background": "rgba(0,0,0,.1)",
	"clipPath": {
		"rx": 0,
		"ry": 0,
		"selectable": false,
		"hasControls": false,
		"type": "Rect",
		"version": "6.7.1",
		"originX": "left",
		"originY": "top",
		"left": -630.4375,
		"top": -830.5,
		"width": 1242,
		"height": 1660,
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
	}
}
`;
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
