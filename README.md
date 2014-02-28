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

3. Instantiate with `options`. If you are using multiple timelines in one page, `options` can be set on each individual timeline:<br />

    See API: [Options](#options)

		$.UDNZTimeline({
			"data_url": "url/or/path/to/data.json",
			"container": {
				"id": "demo_1_container"
			}
		}).Draw();

4. Build your data.

    See API: [Data structure](#data-structure).

5. Enjoy it!

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
            },
            "offsetY": 50
        },
        "lines": {
			"type": "solid",
            "width": 8,
            "color": "#C3C3C3",
            "color_dotted": "#C3C3C3",
            "color_bezier": "#C3C3C3",
            "stroke_dasharray": "16, 8"
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

**Tips:**
* Some of the `effect` defined in `$.DEFINED_EFFECT_TYPE` could be combined.
* Bezier lines could not be dotted.

####Meanings
Option  | Description
------------- | -------------
option.data_url  | **REQUIRED**. The path of JSON data. Supporting both relative or absolute URL.
option.container.id | **REQUIRED**. The element ID of containner.
option.container.width | [Optional] The width of timeline. Number, in `px`.
option.container.height | [Optional] The height of timeline. Number, in `px`.
option.figure.offset.x | [Optional] Global horizontal offset. Number, in `px`.
option.figure.offset.y | [Optional] Global vertical offset. Number, in `px`.
*option.dots.states.normal._stateId* | [Optional] Internal, please ignore it.
option.dots.states.normal.color | [Optional] The color of nodes.
option.dots.states.normal.color_background | [Optional] The background color of nodes.
option.dots.states.normal.radius | [Optional] The radius of nodes. Number, in `px`.
option.dots.states.normal.border | [Optional] The border of nodes. Number, in `px`.
*option.dots.states.active._stateId* | [Optional] Internal, please ignore it.
option.dots.states.active.color | [Optional] The color of nodes when mouse over.
option.dots.states.active.color_background | [Optional] The background color of nodes when mouse over.
option.dots.states.active.radius | [Optional] The radius of nodes when mouse over. Number, in `px`.
option.dots.states.active.border | [Optional] The border of nodes when mouse over. Number, in `px`.
option.dots.offsetY | [Optional] The vertical offset of branches. Number, in `px`.
option.lines.type | [Optional] The type of lines. `dotted` or other values for solid line.
option.lines.width | [Optional] The width of lines. Number, in `px`.
option.lines.color | [Optional] The color of solid lines.
option.lines.color_dotted | [Optional] The color of dotted lines.
option.lines.color_bezier | [Optional] The color of bezier lines.
option.lines.stoke_dasharray | [Optional] Makes sinse only if `option.lines.type`===`dotted`. The length of real and imaginary parts in dotted lines. Numbers, in `px`. e.g. `16 8`.
option.board.width | [Optional] The width of detail board. Number, in `px`.
option.board.color_background | [Optional] The background color of detail board.
option.board.color_border | [Optional] The border color of detail board.
option.board.margin | [Optional] The margin on left/right between the detail board and node. Number, in `px`.
option.board.border | [Optional] The border width of detail board. Number, in `px`.
option.board.spliter_width | [Optional] The width of spliter in detail board. Number, in `px`.
option.effect | [Optional] The effect of displaying detail board. See: `$.DEFINED_EFFECT_TYPE`


###Data structure
The data should be a relative or absolute URL, it will be loaded by Ajax while drawing the timeline.
Here it is:

####Structure

```Javascript
{
    "nodes": [
        {
            "nodeId": // string,
            "title": // string,
            "date": // string in format of date and time, Not used so far.
            "percent": // int,
            "description": // string,
            "states": // JSON object,
            "lines": // JSON object,
            "board": // JSON object,
            "nodes":[
                {
                    "nodeId": // string,
                    "title": // string,
                    "date": // string in format of date time.,
                    "percent": // int,
                    "description": // string,
                    "offsetY": // "up" or int,
                    "states": // JSON object,
                    "lines": // JSON object,
                    "board": // JSON object,
                },
                // other nodes
            ]
        },
        // other nodes
    ]
}
```

####Meanings
Data node  | Description
------------- | -------------
nodes.nodeId | **REQUIRED** Globally unique ID, levels ignored.
nodes.title | **REQUIRED** The title which is displayed on the board as `header`
*nodes.date* | [Optional] Not used so far.
nodes.percent | **REQUIRED** The position of node.  Number, between 0 and 100. [0,100]
nodes.description | **REQUIRED** The detail message which is displayed on the board as `content`
nodes.states | [Optional] Same as `option.dots.states`
nodes.lines | [Optional] Same as `option.lines`
nodes.board | [Optional] Same as `option.board`
nodes.nodes | [Optional] Array of branch nodes. They will be displayed as a branch.
nodes.nodes.nodeId | **REQUIRED if `nodes.nodes` exists** Same as `nodes.nodeId`
nodes.nodes.title | **REQUIRED if `nodes.nodes` exists** Same as `nodes.title`
*nodes.nodes.date* | [Optional] Same as `nodes.date`
nodes.nodes.percent | **REQUIRED if `nodes.nodes` exists** Same as `nodes.percent`
nodes.nodes.description | **REQUIRED if `nodes.nodes` exists** Same as `nodes.description`
nodes.nodes.offsetY | [Optional] Same as `option.dots.offsetY` Number, in `px`, or string `up`.
nodes.nodes.states | [Optional] Same as `option.dots.states`
nodes.nodes.lines | [Optional] Same as `option.lines`
nodes.nodes.board | [Optional] Same as `option.board`

###Methods
```Javascript
        /*
         * Draw the timeline.
         * */
        Draw = function () {...}
```

```Javascript
        /*
         * Show a specified node.
         * @nodeId: *required*, the ID of node.
         * @delay: optional, the delay time in ms.
         * */
        ShowNode = function (nodeId, delay) {...}
```

```Javascript
        /*
         * Show a specified node without callback.
         * @nodeId: *required*, the ID of node.
         * @callback: *required*, function(callback_data) {...}
         * */
        ShowNodeCB = function (nodeId, callback, callback_data) {...}
```

```Javascript
        /*
         * Hide all nodes with delay.
         * @delay: optional, the time of delay, in ms.
         * */
        HideNode = function (delay) {...}
```

```Javascript
        /*
         * Hide all nodes with callback.
         * @callback: *required*, function(callback_data) {...}
         * */
        HideNodeCB = function (callback, callback_data) {...}
```
**Tips:**
* You can call the method `ShowNode` as soon as the timeline drawed, like this:

```Javascript 
// There must be a delay due to the method `Draw` needs time.
$.UDNZTimeline(*options*).Draw().ShowNode('node_5',500);
```

* Perhaps you have noticed that the callback function appear to be earlier than the actual function calls `ShowNodeCB`/`HideNodeCB`, which is normal and correct. The reason why this is so, because the methods `ShowNodeCB`/`HideNodeCB` just specify an animation "Show"/"Hide", will not do any real work which needs time.

## Change Log
###### v1.0 (2/28/2014)
*	First release
	

## License
UDNZTimeline by Austin Luo (uonun) is licensed under a GPL License. Really all that's important to me is that please [let me know](http://work.udnz.com/Contact.aspx "contact") if you find any bug or improvement.

