UDNZTimeline
==========

Overview
---
* It is a light javascript library.
* For helping you to build a smart, beauty and dynamic timeline.
* Based on HTML5, CSS3 and jQuery.
* Supporting Chrome, Opera, Safari, and IE 9+ on PC/MAC and mobile(IPad, Android, Windows Phone).

Demo
---
* http://work.udnz.com/UDNZTimeline/Demo/

Requirements
---
* Javascript with jQuery.
* Modern browser which is supporting HTML5 and CSS3.

Usage
---
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

Sample
---
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
