/*
 * the structure of each note:
 *  {
 *      "nodeId":"nodeid_n",
 *      "title": "",
 *      "date": "2001/09/01 00:00:00",
 *      "percent":20,            // the location of current note in the timeline.
 *      "offsetY": "up",         // up, down or number
 *      "description": ""
 *  },
 * */
(function ($) {
    $.DEFINED_EFFECT_TYPE = {
        curt: 1,
        fade: 2,
        slide: 4,
        translate: 8,
        rotateX: 16,
        rotateY: 32
    };

    $._this = null;

    var defaults = {
        "id": null,
        "data_url": "Data/timeline-nodes.json",
        "css_class": "__tl_svg",
        "container": {
            "id": "timeline_container", // the ID of container DOM.
            "ref": null,
            "width": 0,
            "height": 250
        },
        "figure": {
            "id": "",
            "ref": null,
            "offset": {
                x: 0,
                y: 0
            }
        },
        "dots": {
            "required": {
                "css": {
                    "master": "__tl_master-dot",
                    "branch": "__tl_branch-dot",
                    "branching": "__tl_branching-dot"
                }
            },
            "states": {
                "normal": {
                    "stateId": 0,
                    "color": "#C3C3C3",
                    "color_background": "#fff000",
                    "radius": 12,
                    "border": 12
                },
                "active": {
                    "stateId": 1,
                    "color": "#ff8800",
                    "radius": 15,
                    "border": 5
                }
            }
        },
        "lines": {
            "required": {
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
    var const_dataId_spliter = ",";
    var dotDomTag = "dot";

    UDNZTimelineJS = function (options) {
        var _this = $._this = this;
        this.params = $.extend(true, {}, defaults, options || {});
        this.params.id = "TimelineJS_" + parseInt(Math.random() * 1000000000);
        this._lastPoint = {x: 0, y: 0};
        this._cache = {data: null};

        this.Draw = function () {
            var container = $("#" + this.params.container.id);
            if (container.length == 0) {
                this.__showErrMsg("Can not get the container: #" + this.params.container.id + " !");
                return null;
            }

            this.params.container.ref = container;

            // prepare the svg.
            var svg = this.__createElementNS(document, 'svg', 'http://www.w3.org/2000/svg');
            if (!!svg) {
                svg.setAttribute("id", this.params.id);
                svg.setAttribute("class", this.params.css_class);
                svg.setAttribute("height", this.params.container.height);
                svg.setAttribute("width", "100%");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                this.params.figure.id = this.__getPrivateDomId("svg_container");
                // generate figure container.
                container.prepend("<div " +
                    "id='" + this.params.figure.id + "' " +
                    "class='" + this.__getEffectStyle() + "'" +
                    "style='position: relative; overflow: hidden;'" +
                    "></div>");

                // get the DOM after generating.
                this.params.figure.ref = $("#" + this.params.figure.id);
                this.params.figure.ref.prepend(svg);

                // generate detail dashboard.
                // the svg must be the first child of <figure> for we are using absolute position by <figure>.
                this.params.figure.ref.append(
                    "<div id='" + this.params.container.id + "_board' class='__tl_info'><header></header><div class='__tl_detail'></div></div>"
                );

                // load and draw.
                this.__loadNodes();
            }

            return this;
        };

        this.ShowNode = function (nodeId, delay) {
            var internalId = "#" + this.__getPrivateDomId(nodeId);
            if (!!delay) {
                setTimeout("$._this.__showDetail('" + internalId + "')", delay);
            } else {
                this.__showDetail(internalId);
            }

            return this;
        }

        this.ShowNodeCB = function (nodeId, callback, callback_data) {
            this.ShowNode(nodeId);
            try {
                callback(callback_data);
            } catch (e) {
                this.__showErrMsg("[HideNodeCB] Got error while executing callback.<br />&nbsp;&nbsp;name: " + e.name + "<br />&nbsp;&nbsp;message: " + e.message);
            }
            return this;
        };

        this.HideNode = function (delay) {
            if (!!delay) {
                setTimeout("__hideDetail()", delay);
            } else {
                this.__hideDetail();
            }

            return this;
        }

        this.HideNodeCB = function (callback, callback_data) {
            this.HideNode();
            try {
                callback(callback_data);
            } catch (e) {
                this.__showErrMsg("[HideNodeCB] Got error while executing callback.<br />&nbsp;&nbsp;name: " + e.name + "<br />&nbsp;&nbsp;message: " + e.message);
            }
            return this;
        }

        this.__loadNodes = function () {
            if (!!!this.params.container.width || isNaN(this.params.container.width)) {
                this.params.container.width = parseInt(this.params.container.ref.width());
            }
            else {
                this.params.container.ref.css("width", this.params.container.width + "px");
            }

            var svg = $("#" + this.params.id)[0];
            if (!!svg) {
                svg.setAttribute("height", this.params.container.height);
                svg.setAttribute("width", this.params.container.width);

                // remove all old stuff.
                this.params.container.ref.find(".__tl_removable").remove();

                // the first point
                this._lastPoint.x = 0;
                this._lastPoint.y = this.params.container.height / 2;


                if (!!this._cache.data) {
                    this.__drawNodes(this._cache.data);
                } else {
                    $.ajax({type: "GET", url: this.params.data_url, dataType: "json", context: this, success: function (data) {
                        this._cache.data = data;
                        this.__drawNodes(data);
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        this.__showErrMsg("Data error, Please check the file: \"" + this.url + "\" !");
                    }});
                }
            } else {
                this.__showErrMsg("Can not create &lt;svg&gt;!");
            }
        };

        this.__drawNodes = function (data) {
            var svg = $("#" + this.params.id)[0];
            for (var idx in data.nodes) {
                var node = data.nodes[idx];
                var pFrom = {
                    x: this._lastPoint.x,
                    y: this._lastPoint.y
                };
                var pTo = {
                    x: parseInt(this.params.container.width) / 100 * parseInt(node.percent),
                    y: parseInt(this.params.container.height / 2) // + Math.random() * 50 - 25;
                };

                this.__drawLine({
                    svg: svg,
                    cls: this.params.lines.required.css.master,
                    from: pFrom,
                    to: pTo,
                    node: node
                });

                var dotCss = "";
                // draw branches
                if (!!node.nodes) {
                    dotCss += this.params.dots.required.css.branching + " ";
                    var branchOffsetY = this.params.lines.branchOffsetY;
                    var pFrom2 = {
                        x: pTo.x,
                        y: pTo.y
                    };

                    for (var i in node.nodes) {
                        var item = node.nodes[i];
                        var offsetSymbol = 1;
                        if (!!item.offsetY) {
                            if (item.offsetY === "up" || item.offsetY === "down") {
                                offsetSymbol = item.offsetY === "up" ? -1 : 1;
                            } else if (!isNaN(item.offsetY)) {
                                offsetSymbol = item.offsetY > 0 ? 1 : -1;
                            }
                        }

                        if (!isNaN(item.offsetY)) {
                            branchOffsetY = item.offsetY;
                        } else {
                            item.offsetY = branchOffsetY * offsetSymbol;
                            branchOffsetY = item.offsetY;
                        }

                        var pToChild = {
                            x: parseInt(this.params.container.width) / 100 * parseInt(item.percent),
                            y: parseInt(this.params.container.height) / 2 + parseInt(item.offsetY)
                        };

                        var method = Math.abs(pFrom2.y - pToChild.y) < 5 ? this.__drawLine : this.__drawBezier;
                        // must use the method "call" to rewrite "this" as current instance of UDNZTimelineJS while not window.
                        method.call(this, {
                            svg: svg,
                            cls: this.params.lines.required.css.branch,
                            from: pFrom2,
                            to: pToChild,
                            node: item
                        });
                        var dataId = idx + const_dataId_spliter + i;
                        this.__drawHotDot(dataId, this.params.dots.required.css.branch, pToChild);
                        pFrom2 = pToChild;
                    }
                }
                dotCss += this.params.dots.required.css.master;

                // draw trunk
                this.__drawHotDot(idx, dotCss, pTo);
                this._lastPoint = pTo;
            }
        };

        /*
         * Draw a hot dot onto the time-line.
         * @dataId: the index of node. could be like them: "2" or "2,1". (const_dataId_spliter = ",“)
         * */
        this.__drawHotDot = function (dataId, cssName, to) {
            // apply global offset for the figure.
            to = this.__applyOffset(to, this.params.figure.offset);

            var id = null;
            var showIt = false;
            var node = this.__getNodeByDataId(dataId);
            if (!!node) {
                id = node.nodeId;
                showIt = node.show;
            }

            if (!!!id) {
                id = "__tl_HotDot_" + Math.round(Math.random() * 10000);
            }

            id = this.__getPrivateDomId(id);

            var dotStyle = this.__getHotDotStyle({
                dom: null,
                state: this.__getHotDotState(0, null, node),
                position: to,
                node: node
            });

            this.params.figure.ref.append("<" + dotDomTag + " id='" + id + "' " +
                "class='" + cssName + " __tl_removable' " +
                "dataId='" + dataId + "' " +
                "x='" + to.x + "' " +
                "y='" + to.y + "'" +
                "style='" + dotStyle + "'" +
                "></" + dotDomTag + ">");

            $("#" + id).mouseenter(function () {
                _this.__showDetail("#" + id);
            }).mouseleave(function () {
                    _this.__hideDetail("#" + id);
                });

            if (showIt)
                this.__showDetail("#" + id);
        };

        this.__drawLine = function (args) {
            var svg = args.svg,
                cls = args.cls,
                from = args.from,
                to = args.to,
                node = args.node;

            // apply global offset for the figure.
            from = this.__applyOffset(from, this.params.figure.offset);
            to = this.__applyOffset(to, this.params.figure.offset);

            // build lineStyle
            {
                var lineStyle = "";

                if (!!node && !!node.lines) {
                    node.lines = $.extend(true, {}, this.params.lines, node.lines || {});
                    if (!!node.lines.type && node.lines.type === "dotted") {
                        lineStyle += "stroke-dasharray:" + node.lines.stroke_dasharray + ";";
                        lineStyle += "stroke:" + node.lines.color_dotted + ";";
                    } else {
                        lineStyle += "stroke:" + node.lines.color + ";";
                    }
                    lineStyle += "stroke-width:" + node.lines.width + ";";
                } else {
                    lineStyle = "stroke-width:" + this.params.lines.width + ";";
                    lineStyle += "stroke:" + this.params.lines.color + ";";
                }
            }

            var line = this.__createElementNS(document, 'line', 'http://www.w3.org/2000/svg');
            if (!!line) {
                line.setAttribute("class", cls + " __tl_removable");
                line.setAttribute("x1", from.x);
                line.setAttribute("y1", from.y);
                line.setAttribute("x2", to.x);
                line.setAttribute("y2", to.y);
                line.setAttribute("style", lineStyle);
                svg.appendChild(line);
            }
        };

        this.__drawBezier = function (args) {
            var svg = args.svg,
                cls = args.cls,
                from = args.from,
                to = args.to,
                node = args.node;

            // apply global offset for the figure.
            from = this.__applyOffset(from, this.params.figure.offset);
            to = this.__applyOffset(to, this.params.figure.offset);

            var offset = to.y - from.y;
            var d = "M";
            d += from.x + " " + from.y + " ";
            d += "Q" + parseInt(from.x + Math.abs(offset)) + " " + parseInt(from.y + offset) + " " + to.x + " " + parseInt(to.y - this.params.lines.width / 2) + " ";
            d += "L" + to.x + " " + parseInt(to.y + this.params.lines.width / 2) + " ";
            d += "Q" + parseInt(from.x + Math.abs(offset)) + " " + parseInt(to.y + this.params.lines.width / 2) + " " + from.x + " " + from.y + " ";
            d += "Z";
            var path = this.__createElementNS(document, 'path', 'http://www.w3.org/2000/svg');
            if (!!path) {
                path.setAttribute("class", cls + " __tl_removable");
                path.setAttribute("d", d);
                path.setAttribute("stroke-width", "0");
                path.setAttribute("style", "fill:" + this.params.lines.color_bezier);
                svg.appendChild(path);
            }
        };

        this.__showDetail = function (dot) {
            var dotDom = $(dot)[0];
            if (!!!dotDom) return;

            var div = $("#" + this.params.container.id + " .__tl_info");
            var dataId = $(dot).attr("dataId");
            if (!!dataId) {

                this.__hideDetail();

                var offsetY = dotDom.offsetTop;
                var node = this.__getNodeByDataId(dataId);
                if (!!node) {
                    // fill the required/defined member.
                    var dots_cfg = $.extend(true, {}, this.params.dots.states.active, node.states || {});
                    var board_cfg = $.extend(true, {}, this.params.board, node.board || {});

                    // fill content
                    div.find("header").html(node.title);
                    div.find(".__tl_detail")
                        .html(node.description)
                        .css("margin-top", board_cfg.spliter_width + "px");

                    // set position
                    {
                        var offsetFromDot = dotDom.offsetHeight / 2;                            // offset caused by Dot DOM
                        var offsetFromBoard = div.height() / 2 + board_cfg.border + board_cfg.spliter_width;     // offset caused by Board DOM
                        var offsetFromLine = this.params.lines.width / 2;                             // offset caused by Line DOM
                        var top = offsetY - offsetFromBoard + offsetFromLine + offsetFromDot;
                        if (dotDom.offsetLeft < this.params.container.width / 2) {
                            var left = (dotDom.offsetLeft < 0 ? 0 : dotDom.offsetLeft) + board_cfg.margin + dots_cfg.radius * 2 + dots_cfg.border;
                            div.css("left", left + "px")
                                .css("top", top + "px")
                                .addClass("__tl_showOnRight");
                        } else {
                            var left = dotDom.offsetLeft - $(div).width() - board_cfg.margin - dots_cfg.radius - dots_cfg.border;
                            div.css("left", left + "px")
                                .css("top", top + "px")
                                .addClass("__tl_showOnLeft");
                        }
                    }


                    // set the state of current dot as active.
                    $(dot).addClass("__tl_dot_current").attr("style", this.__getHotDotStyle({
                        dom: dotDom,
                        state: this.__getHotDotState(1, dotDom, node),
                        position: null,
                        node: node
                    }));

                    // set detail board
                    $(".__tl_info").css("width", board_cfg.width + "px")
                        .css("background-color", board_cfg.color_bg)
                        .css("padding", board_cfg.border + "px");
                }
            }
        };

        this.__hideDetail = function () {
            var div = $("#" + this.params.container.id + " .__tl_info");
            div.removeClass("__tl_showOnLeft").removeClass("__tl_showOnRight");

            // set the state of other dots to normal
            this.params.figure.ref.find(".__tl_dot_current").each(function () {
                $(this).removeClass("__tl_dot_current").attr("style", _this.__getHotDotStyle({
                    dom: this,
                    state: _this.__getHotDotState(0, this, null),
                    position: null,
                    node: null
                }));
            });
        };

        this.__createElementNS = function (parent, tagName, namespace) {
            var dom = null;
            if (!!parent.createElementNS) // createElementNS is not supported in IE
                dom = parent.createElementNS(namespace, tagName);
            else
                dom = parent.createElement(tagName);
            return dom;
        };

        this.__getNodeByDataId = function (dataId) {
            var result = null;
            if (!!dataId) {
                // e.g.: ids [3,1]
                var ids = dataId.split(const_dataId_spliter);
                var idLv0 = parseInt(ids[0]), idLv1 = parseInt(ids[1]);
                if (!!this._cache.data && !!this._cache.data.nodes && this._cache.data.nodes.length > parseInt(idLv0)) {
                    result = this._cache.data.nodes[idLv0];
                    if (!!result && !!result.nodes) {
                        if (idLv1 >= 0 && result.nodes.length > idLv1) {
                            result = result.nodes[idLv1];
                        }
                    }
                }
            }
            return result;
        };

        this.__getPrivateDomId = function (domId) {
            return this.params.id + "_" + domId;
        }

        this.__applyOffset = function (pSrc, offset) {
            return {x: pSrc.x + offset.x, y: pSrc.y + offset.y};
        }

        /*
         *   @args: must be a JSON structure:
         *       {
         *           dom: ...,       // the DOM
         *           state:...,      // see defaults.dots.states
         *           position:...,   // the position {x,y}
         *           node:...        // the data node
         *       }
         * */
        this.__getHotDotStyle = function (args) {
            var dom = args.dom;
            var state = args.state;
            var position = args.position;
            var node = args.node;

            if (!!node && !!node.states) {
                state = $.extend(true, {}, args.state, args.state.stateId == 1 ? node.states.active : node.states.normal || {});
            }

            var dotStyle =
                "width:" + parseInt(state.radius) * 2 + "px;" +
                    "height:" + parseInt(state.radius) * 2 + "px;" +
                    "margin:" + parseInt(state.radius) * -1 + "px 0 0 " + parseInt(state.radius) * -1 + "px;" +
                    "border:" + parseInt(state.border) + "px solid " + state.color + ";";

            if (!!!position) {
                dom = $(dom);
                position = {x: dom.attr("x"), y: dom.attr("y")};
            }

            dotStyle += "left:" + position.x + "px;" +
                "top:" + position.y + "px;";

            return dotStyle;
        }

        /*
         * @stateId: 0 = normal, 1 = active
         * */
        this.__getHotDotState = function (stateId, dom, node) {
            if (!!!node) {
                if (!!dom) {
                    node = this.__getNodeByDataId($(dom).attr("dataId"));
                }
            }

            var states = this.params.dots.states;
            if (!!node && !!node.states) {
                states = node.states;
            }

            // fill the required/defined member.
            states = $.extend(true, {}, this.params.dots.states, states || {});

            return stateId == 1 ? states.active : states.normal;
        }

        this.__getEffectStyle = function () {
            if (this.params.effect == 0)
                this.params.effect = defaults.effect;

            var figureCls = "";
            if (this.params.effect == $.DEFINED_EFFECT_TYPE.slide) {
                // slide could NOT be used stand alone.
                this.params.effect |= $.DEFINED_EFFECT_TYPE.fade;
            }

            if ((this.params.effect & $.DEFINED_EFFECT_TYPE.curt) == $.DEFINED_EFFECT_TYPE.curt) {
                // curt MUST be used stand alone only.
                figureCls = "__tl_e_curt";
            } else {
                if ((this.params.effect & $.DEFINED_EFFECT_TYPE.fade) == $.DEFINED_EFFECT_TYPE.fade)
                    figureCls += " __tl_e_fade";

                if ((this.params.effect & $.DEFINED_EFFECT_TYPE.rotateX) == $.DEFINED_EFFECT_TYPE.rotateX)
                    figureCls += " __tl_e_rotateX";

                if ((this.params.effect & $.DEFINED_EFFECT_TYPE.rotateY) == $.DEFINED_EFFECT_TYPE.rotateY)
                    figureCls += " __tl_e_rotateY";

                if ((this.params.effect & $.DEFINED_EFFECT_TYPE.slide) == $.DEFINED_EFFECT_TYPE.slide)
                    figureCls += " __tl_e_slide";

                if ((this.params.effect & $.DEFINED_EFFECT_TYPE.translate) == $.DEFINED_EFFECT_TYPE.translate)
                    figureCls += " __tl_e_translate";
            }

            return figureCls;
        }

        this.__showErrMsg = function (msg) {
            var msgDom = "<strong>Error:</strong><div class='__tl_err_msg'>" + msg + "</div>";
            if (!!this.params.container.ref && this.params.container.ref.length > 0) {
                this.params.container.ref.html("<div class='__tl_err'>" + msgDom + "</div>");
            } else {

                $("body").append("<div class='__tl_err' style='position: absolute;top:20%;left:20%;z-index:10000'>" + msgDom + "</div>");
            }
        }

        $(window).resize(function () {
            // the container is re-sized, we must calculate the width of figure again.
            // but fortunately, the method "__loadNodes" will calculate the width by-effect if the value is zero.
            // ok, so, just set to zero and let the method calculate it!
            _this.params.container.width = 0;
            _this.__loadNodes();
        });

        return this;
    };

    $.UDNZTimeline = function (options) {
        var instance = new UDNZTimelineJS(options);
        return instance;
    }

})(jQuery);