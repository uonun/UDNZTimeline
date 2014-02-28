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
        "_id": null,
        "data_url": "Data/timeline-nodes.json",
        "_css_class": "__tl_svg",
        "container": {
            "id": "timeline_container",
            "_ref": null,
            "width": 0,
            "height": 250
        },
        "figure": {
            "_id": "",
            "_ref": null,
            "offset": {
                x: 0,
                y: 0
            }
        },
        "dots": {
            "_required": {
                "css": {
                    "master": "__tl_master-dot",
                    "branch": "__tl_branch-dot",
                    "branching": "__tl_branching-dot"
                }
            },
            "states": {
                "normal": {
                    "_stateId": 0,
                    "color": "#C3C3C3",
                    "color_background": "#fff000",
                    "radius": 12,
                    "border": 12
                },
                "active": {
                    "_stateId": 1,
                    "color": "#ff8800",
                    "radius": 15,
                    "border": 5
                }
            }
        },
        "lines": {
            "_required": {
                "css": {
                    "master": "__tl_solid-line __tl_master",
                    "branch": "__tl_solid-line __tl_branch"
                }
            },
            "width": 8,
            "color": "#C3C3C3",
            "color_dotted": "#C3C3C3",
            "color_bezier": "#C3C3C3",
            "stroke_dasharray": "16, 8",
            "branchOffsetY": 50
        },
        "board": {
            "width": 220,
            "color_bg": "#ff8800",
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
option._id  | 
option.data_url  | 
option._css_class | 
option.container.id | 
option.container._ref | 
option.container.width | 
option.container.height | 
option.figure._id | 
option.figure._ref | 
option.figure.offset.x | 
option.figure.offset.y | 
option.dots._required.* | 
option.dots.states.normal._stateId | 
option.dots.states.normal.color | 
option.dots.states.normal.color_background | 
option.dots.states.normal.radius | 
option.dots.states.normal.border | 
option.dots.states.active._stateId | 
option.dots.states.active.color | 
option.dots.states.active.color_background | 
option.dots.states.active.radius | 
option.dots.states.active.border | 
option.lines._required.* | 
option.lines.width | 
option.lines.color | 
option.lines.color_dotted | 
option.lines.bezier | 
option.lines.stoke_dasharray | 
option.lines.branchOffsetY | 
option.board.width | 
option.board.color_bg | 
option.board.margin | 
option.board.border | 
option.board.spliter_width | 
option.effect | 


###Data structure
The data should be a relative or absolute URL, it will be loaded by Ajax while drawing the timeline.

