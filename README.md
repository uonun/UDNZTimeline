#UDNZTimeline

##Overview
* It is a light javascript library.
* For helping you to build a smart, beauty and dynamic timeline.
* Based on HTML5, CSS3 and jQuery.
* Supporting Chrome, Opera, Safari, and IE 9+ on PC/MAC and mobile(IPad, Android, Windows Phone).

##Demo
* http://work.udnz.com/UDNZTimeline/Demo/

##Requirements
* Javascript with jQuery.
* Modern browser which is supporting HTML5 and CSS3.

##Usage
1. Include `timeline.css`, `jQuery.min.js` and `timeline.js`

		<link rel="stylesheet" href="path/to/timeline.css"/>
		<script src="path/to/jquery.min.js"></script>
		<script src="path/to/timeline.js"></script>

2. Set up an element with an ID to handle the timeline.

		<div id="demo_1_container"></div>

3. Build your data.

    See API: Data structure.

4. Instantiate with options. If you are using multiple timelines in one page, options can be set on each individual timeline:

		$.UDNZTimeline({
			"data_url": "url/or/path/to/data.json",
			"container": {
				"id": "demo_1_container"
			}
		}).Draw();

4. Enjoy it!

##Sample
```HTML
<!DOCTYPE html>
<html>
<head>
    <title>UDNZTimeline by udnz.com</title>
    <link rel="stylesheet" href="path/to/timeline.css"/>
    <script src="path/to/jquery.min.js"></script>
    <script src="path/to/timeline.js"></script>
    <script>
        $(function () {
            $.UDNZTimeline({
                "data_url": "url/or/path/to/data.json",
                "container": {
                    "id": "demo_1_container"
                }
            }).Draw();
        });
    </script>
</head>
<body>
<div id="demo_1_container"></div>
</body>
</html>
```

##API
###Options
Like other javascript librarys, you can define an `option` in JSON as well. Here are the structure and meanings:

####Structure and default values
```Javascript
    // default values
    var defaults = {
        "data_url": "Data/timeline-nodes.json",
        "container": {
            "id": "timeline_container",
            "width": 0,
            "height": 250
        },
        "figure": {
            "offset": {
                x: 0,
                y: 0
            }
        },
        "dots": {
            "states": {
                "normal": {
                    "_stateId": 0,
                    "color": "#C3C3C3",
                    "color_background": "#ffffff",
                    "radius": 12,
                    "border": 12
                },
                "active": {
                    "_stateId": 1,
                    "color": "#ff8800",
                    "color_background": "#ffffff",
                    "radius": 15,
                    "border": 5
                }
            }
        },
        "lines": {
            "width": 8,
            "color": "#C3C3C3",
            "color_dotted": "#C3C3C3",
            "color_bezier": "#C3C3C3",
            "stroke_dasharray": "16, 8",
            "branchOffsetY": 50
        },
        "board": {
            "width": 220,
            "color_background": "#FFFFFF",
            "color_border": "#ff8800",
            "margin": 10,
            "border": 5,
            "spliter_width": 3
        },
        "effect": $.DEFINED_EFFECT_TYPE.fade | $.DEFINED_EFFECT_TYPE.translate
    };
    
    // defined effects
    $.DEFINED_EFFECT_TYPE = {
        curt: 1,
        fade: 2,
        slide: 4,
        translate: 8,
        rotateX: 16,
        rotateY: 32
    };
```
####Meanings
Option  | Description
------------- | -------------
option.data_url  | **REQUIRED**. The path of JSON data. Supporting both relative or absolute URL.
option.container.id | **REQUIRED**. The element ID of containner.
option.container.width | The width of timeline.
option.container.height | The height of timeline.
option.figure.offset.x | Global horizontal offset.
option.figure.offset.y | Global vertical offset.
*option.dots.states.normal._stateId* | Internal, please ignore it.
option.dots.states.normal.color | The color of nodes.
option.dots.states.normal.color_background | The background color of nodes.
option.dots.states.normal.radius | The radius of nodes.
option.dots.states.normal.border | The border of nodes.
*option.dots.states.active._stateId* | Internal, please ignore it.
option.dots.states.active.color | The color of nodes when mouse over.
option.dots.states.active.color_background | The background color of nodes when mouse over.
option.dots.states.active.radius | The radius of nodes when mouse over.
option.dots.states.active.border | The border of nodes when mouse over.
option.lines.width | The width of lines.
option.lines.color | The color of solid lines.
option.lines.color_dotted | The color of dotted lines.
option.lines.color_bezier | The color of bezier lines.
option.lines.stoke_dasharray | The length of real and imaginary parts in dotted lines.
option.lines.branchOffsetY | The vertical offset of branches.
option.board.width | The width of detail board.
option.board.color_background | The background color of detail board.
option.board.color_border | The border color of detail board.
option.board.margin | The margin on left/right between the detail board and node.
option.board.border | The border width of detail board.
option.board.spliter_width | The width of spliter in detail board.
option.effect | The effect of displaying detail board.


###Data structure
The data should be a relative or absolute URL, it will be loaded by Ajax while drawing the timeline.

