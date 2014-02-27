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

    $.UDNZTimeline = function (options) {
        var defaults = {
            '_id': Math.random(),
            'id': 'my_timeline', // the ID of timeline instance.
            'data_url': 'Data/timeline-nodes.json',
            'css_class': '__tl_svg',
            'container': {
                'id': 'timeline_container', // the ID of container DOM.
                'ref': null,
                'width': 0,
                'height': 250
            },
            'figure': {
                'id': '',
                'ref': null,
                'offset': {
                    x: 0,
                    y: 0
                }
            },
            'dots': {
                'required': {
                    "css": {
                        'master': "__tl_master-dot",
                        'branch': "__tl_branch-dot",
                        'branching': '__tl_branching-dot'
                    }
                },
                'states': {
                    'normal': {
                        'stateId': 0,
                        'color': '#C3C3C3',
                        'color_background': '#fff000',
                        'radius': 12,
                        'border': 12
                    },
                    'active': {
                        'stateId': 1,
                        'color': '#ff8800',
                        'radius': 15,
                        'border': 5
                    }
                }
            },
            'lines': {
                'required': {
                    "css": {
                        'master': "__tl_solid-line __tl_master",
                        'branch': "__tl_solid-line __tl_branch"
                    }
                },
                'width': 8,
                'color': '#C3C3C3',
                'color_dotted': '#C3C3C3',
                'color_bezier': '#C3C3C3',
                'stroke_dasharray': '16, 8',
                "branchOffsetY": 50
            },
            'board': {
                'width': 220,
                'color_bg': '#ff8800',
                'margin': 10,
                'border': 5,
                'spliter_width': 3
            },
            'effect': $.DEFINED_EFFECT_TYPE.fade | $.DEFINED_EFFECT_TYPE.translate
        };

        param = $.extend(true, {}, defaults, options || {});

        var _lastPoint = {x: 0, y: 0};
        var _cache = {data: null};
        var const_dataId_spliter = ",";

        this.Draw = function () {
            var container = $("#" + param.container.id);
            if (container.length == 0) {
                __showErrMsg("Can not get the container: #" + param.container.id + " !");
                return null;
            }

            param.container.ref = container;

            // prepare the svg.
            var svg = __createElementNS(document, 'svg', 'http://www.w3.org/2000/svg');
            if (!!svg) {
                svg.setAttribute("id", param.id);
                svg.setAttribute("class", param.css_class);
                svg.setAttribute("height", param.container.height);
                svg.setAttribute("width", "100%");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                param.figure.id = __getPrivateDomId("svg_container");
                // generate figure container.
                container.prepend("<div " +
                    "id='" + param.figure.id + "' " +
                    "class='" + __getEffectStyle() + "'" +
                    "style='position: relative; overflow: hidden;'" +
                    "></div>");

                // get the DOM after generating.
                param.figure.ref = $("#" + param.figure.id);
                param.figure.ref.prepend(svg);

                // generate detail dashboard.
                // the svg must be the first child of <figure> for we are using absolute position by <figure>.
                param.figure.ref.append(
                    "<div id='" + param.container.id + "_board' class='__tl_info'><header></header><div class='__tl_detail'></div></div>"
                );

                // load and draw.
                __loadNodes();
            }

            return this;
        };

        this.ShowNode = function (nodeId, delay) {
            var internalId = "#" + __getPrivateDomId(nodeId);
            if (!!delay) {
                setTimeout("__showDetail('" + internalId + "')", delay);
            } else {
                __showDetail(internalId);
            }

            return this;
        }

        this.ShowNodeCB = function (nodeId, callback, callback_data) {
            this.ShowNode(nodeId);
            callback(callback_data);
            return this;
        };

        this.HideNode = function (nodeId, delay) {
            var internalId = "#" + __getPrivateDomId(nodeId);
            if (!!delay) {
                setTimeout("__hideDetail('" + internalId + "')", delay);
            } else {
                __hideDetail(internalId);
            }

            return this;
        }

        this.HideNodeCB = function (nodeId, callback, callback_data) {
            this.HideNode(nodeId);
            callback(callback_data);
            return this;
        }

        __loadNodes = function () {
            param.container.width = parseInt(param.container.ref.width());

            var svg = $("#" + param.id)[0];
            if (!!svg) {
                svg.setAttribute("height", param.container.height);
                svg.setAttribute("width", param.container.width);

                // remove all old stuff.
                param.container.ref.find(".__tl_removable").remove();

                // the first point
                _lastPoint.x = 0;
                _lastPoint.y = param.container.height / 2;


                if (!!_cache.data) {
                    __drawNodes(_cache.data);
                } else {
                    $.ajax({type: "GET", url: param.data_url, dataType: "json", success: function (data) {
                        _cache.data = data;
                        __drawNodes(data);
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                        __showErrMsg("Data error, Please check the file: \"" + this.url + "\" !");
                    }});
                }
            } else {
                __showErrMsg("Can not create &lt;svg&gt;!");
            }
        };

        __drawNodes = function (data) {
            var svg = $("#" + param.id)[0];
            for (var idx in data.nodes) {
                var node = data.nodes[idx];
                var pFrom = {
                    x: _lastPoint.x,
                    y: _lastPoint.y
                };
                var pTo = {
                    x: parseInt(param.container.width) / 100 * parseInt(node.percent),
                    y: parseInt(param.container.height / 2) // + Math.random() * 50 - 25;
                };

                __drawLine({
                    svg: svg,
                    cls: param.lines.required.css.master,
                    from: pFrom,
                    to: pTo,
                    node: node
                });

                var dotCss = "";
                // draw branches
                if (!!node.nodes) {
                    dotCss += param.dots.required.css.branching + " ";
                    var branchOffsetY = param.lines.branchOffsetY;
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
                            x: parseInt(param.container.width) / 100 * parseInt(item.percent),
                            y: parseInt(param.container.height) / 2 + parseInt(item.offsetY)
                        };

                        var method = Math.abs(pFrom2.y - pToChild.y) < 5 ? __drawLine : __drawBezier;
                        method({
                            svg: svg,
                            cls: param.lines.required.css.branch,
                            from: pFrom2,
                            to: pToChild,
                            node: item
                        });
                        var dataId = idx + const_dataId_spliter + i;
                        __drawHotDot(dataId, param.dots.required.css.branch, pToChild);
                        pFrom2 = pToChild;
                    }
                }
                dotCss += param.dots.required.css.master;

                // draw trunk
                __drawHotDot(idx, dotCss, pTo);
                _lastPoint = pTo;
            }
        };

        /*
         * Draw a hot dot onto the time-line.
         * @dataId: the index of node. could be like them: "2" or "2,1". (const_dataId_spliter = ",“)
         * */
        __drawHotDot = function (dataId, cssName, to) {
            // apply global offset for the figure.
            to = __applyOffset(to, param.figure.offset);

            var id = null;
            var showIt = false;
            var node = __getNodeByDataId(dataId);
            if (!!node) {
                id = node.nodeId;
                showIt = node.show;
            }

            if (!!!id) {
                id = "__tl_HotDot_" + Math.round(Math.random() * 10000);
            }

            id = __getPrivateDomId(id);

            var dotStyle = __getHotDotStyle({
                dom: null,
                state: __getHotDotState(0, null, node),
                position: to,
                node: node
            });

            param.figure.ref.append("<dot id='" + id + "' " +
                "class='" + cssName + " __tl_removable' " +
                "dataId='" + dataId + "' " +
                "x='" + to.x + "' " +
                "y='" + to.y + "'" +
                "style='" + dotStyle + "'" +
                "></dot>");

            $("#" + id).mouseenter(function () {
                __showDetail("#" + id);
            }).mouseleave(function () {
                    __hideDetail("#" + id);
                });

            if (showIt)
                __showDetail("#" + id);
        };

        __drawLine = function (args) {
            var svg = args.svg,
                cls = args.cls,
                from = args.from,
                to = args.to,
                node = args.node;

            // apply global offset for the figure.
            from = __applyOffset(from, param.figure.offset);
            to = __applyOffset(to, param.figure.offset);

            // build lineStyle
            {
                var lineStyle = "";

                if (!!node && !!node.lines) {
                    node.lines = $.extend(true, {}, param.lines, node.lines || {});
                    if (!!node.lines.type && node.lines.type === "dotted") {
                        lineStyle += "stroke-dasharray:" + node.lines.stroke_dasharray + ";";
                        lineStyle += "stroke:" + node.lines.color_dotted + ";";
                    } else {
                        lineStyle += "stroke:" + node.lines.color + ";";
                    }
                    lineStyle += "stroke-width:" + node.lines.width + ";";
                } else {
                    lineStyle = "stroke-width:" + param.lines.width + ";";
                    lineStyle += "stroke:" + param.lines.color + ";";
                }
            }

            var line = __createElementNS(document, 'line', 'http://www.w3.org/2000/svg');
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

        __drawBezier = function (args) {
            var svg = args.svg,
                cls = args.cls,
                from = args.from,
                to = args.to,
                node = args.node;

            // apply global offset for the figure.
            from = __applyOffset(from, param.figure.offset);
            to = __applyOffset(to, param.figure.offset);

            var offset = to.y - from.y;
            var d = "M";
            d += from.x + " " + from.y + " ";
            d += "Q" + parseInt(from.x + Math.abs(offset)) + " " + parseInt(from.y + offset) + " " + to.x + " " + parseInt(to.y - param.lines.width / 2) + " ";
            d += "L" + to.x + " " + parseInt(to.y + param.lines.width / 2) + " ";
            d += "Q" + parseInt(from.x + Math.abs(offset)) + " " + parseInt(to.y + param.lines.width / 2) + " " + from.x + " " + from.y + " ";
            d += "Z";
            var path = __createElementNS(document, 'path', 'http://www.w3.org/2000/svg');
            if (!!path) {
                path.setAttribute("class", cls + " __tl_removable");
                path.setAttribute("d", d);
                path.setAttribute("stroke-width", "0");
                path.setAttribute("style", "fill:" + param.lines.color_bezier);
                svg.appendChild(path);
            }
        };

        __showDetail = function (dot) {
            var dotDom = $(dot)[0];
            if (!!!dotDom) return;

            var div = $("#" + param.container.id + " .__tl_info");
            var dataId = $(dot).attr("dataId");
            if (!!dataId) {
                var offsetY = dotDom.offsetTop;
                var node = __getNodeByDataId(dataId);
                if (!!node) {
                    // fill the required/defined member.
                    var dots_cfg = $.extend(true, {}, param.dots.states.active, node.states || {});
                    var board_cfg = $.extend(true, {}, param.board, node.board || {});

                    // fill content
                    div.find("header").html(node.title);
                    div.find(".__tl_detail")
                        .html(node.description)
                        .css("margin-top", board_cfg.spliter_width + "px");

                    // set position
                    {
                        var offsetFromDot = dotDom.offsetHeight / 2;                            // offset caused by Dot DOM
                        var offsetFromBoard = div.height() / 2 + board_cfg.border + board_cfg.spliter_width;     // offset caused by Board DOM
                        var offsetFromLine = param.lines.width / 2;                             // offset caused by Line DOM
                        var top = offsetY - offsetFromBoard + offsetFromLine + offsetFromDot;
                        if (dotDom.offsetLeft < param.container.width / 2) {
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

                    // set the state of other dots to normal
                    $(dot).parent().find("div").removeClass("__tl_dot_current");
                    // set the state of current dot as active.
                    $(dot).addClass("__tl_dot_current").attr("style", __getHotDotStyle({
                        dom: dotDom,
                        state: __getHotDotState(1, dotDom, node),
                        position: null,
                        node: node
                    }));

                    // set detail board
                    $(".__tl_info").css("width", board_cfg.width + "px")
                        .css("background-color", board_cfg.color_bg)
                        .css("padding", board_cfg.border + "px")
                    ;
                }
            }
        };

        __hideDetail = function (dot) {
            var dotDom = $(dot)[0];
            if (!!!dotDom) return;

            var div = $(".__tl_info");
            div.removeClass("__tl_showOnLeft").removeClass("__tl_showOnRight");
            $(dot).removeClass("__tl_dot_current").attr("style", __getHotDotStyle({
                dom: dotDom,
                state: __getHotDotState(0, dotDom, null),
                position: null,
                node: null
            }));
        };

        __createElementNS = function (parent, tagName, namespace) {
            var dom = null;
            if (!!parent.createElementNS) // createElementNS is not supported in IE
                dom = parent.createElementNS(namespace, tagName);
            else
                dom = parent.createElement(tagName);
            return dom;
        };

        __getNodeByDataId = function (dataId) {
            var result = null;
            if (!!dataId) {
                // e.g.: ids [3,1]
                var ids = dataId.split(const_dataId_spliter);
                var idLv0 = parseInt(ids[0]), idLv1 = parseInt(ids[1]);
                if (!!_cache.data && !!_cache.data.nodes && _cache.data.nodes.length > parseInt(idLv0)) {
                    result = _cache.data.nodes[idLv0];
                    if (!!result && !!result.nodes) {
                        if (idLv1 >= 0 && result.nodes.length > idLv1) {
                            result = result.nodes[idLv1];
                        }
                    }
                }
            }
            return result;
        };

        __getPrivateDomId = function (domId) {
            return param.id + "_" + domId;
        }

        __applyOffset = function (pSrc, offset) {
            return {x: pSrc.x + offset.x, y: pSrc.y + offset.y};
        }

        /*
         *   @args: the parameter args must be a JSON structure:
         *       {
         *           dom: ...,       // the DOM
         *           state:...,      // see defaults.dots.states
         *           position:...,   // the position {x,y}
         *           node:...        // the data node
         *       }
         * */
        __getHotDotStyle = function (args) {
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
        __getHotDotState = function (stateId, dom, node) {
            if (!!!node) {
                if (!!dom) {
                    node = __getNodeByDataId($(dom).attr("dataId"));
                }
            }

            var states = param.dots.states;
            if (!!node && !!node.states) {
                states = node.states;
            }

            // fill the required/defined member.
            states = $.extend(true, {}, param.dots.states, states || {});

            return stateId == 1 ? states.active : states.normal;
        }

        __getEffectStyle = function () {
            if (param.effect == 0)
                param.effect = defaults.effect;

            var figureCls = "";
            if (param.effect == $.DEFINED_EFFECT_TYPE.slide) {
                // slide could NOT be used stand alone.
                param.effect |= $.DEFINED_EFFECT_TYPE.fade;
            }

            if ((param.effect & $.DEFINED_EFFECT_TYPE.curt) == $.DEFINED_EFFECT_TYPE.curt) {
                // curt MUST be used stand alone only.
                figureCls = "__tl_e_curt";
            } else {
                if ((param.effect & $.DEFINED_EFFECT_TYPE.fade) == $.DEFINED_EFFECT_TYPE.fade)
                    figureCls += " __tl_e_fade";

                if ((param.effect & $.DEFINED_EFFECT_TYPE.rotateX) == $.DEFINED_EFFECT_TYPE.rotateX)
                    figureCls += " __tl_e_rotateX";

                if ((param.effect & $.DEFINED_EFFECT_TYPE.rotateY) == $.DEFINED_EFFECT_TYPE.rotateY)
                    figureCls += " __tl_e_rotateY";

                if ((param.effect & $.DEFINED_EFFECT_TYPE.slide) == $.DEFINED_EFFECT_TYPE.slide)
                    figureCls += " __tl_e_slide";

                if ((param.effect & $.DEFINED_EFFECT_TYPE.translate) == $.DEFINED_EFFECT_TYPE.translate)
                    figureCls += " __tl_e_translate";
            }

            return figureCls;
        }

        __showErrMsg = function (msg) {
            var msgDom = "<strong>Error:</strong><div class='__tl_err_msg'>" + msg + "</div>";
            if (!!param.container.ref && param.container.ref.length > 0) {
                param.container.ref.html("<div class='__tl_err'>" + msgDom + "</div>");
            } else {

                $("body").append("<div class='__tl_err' style='position: absolute;top:20%;left:20%;z-index:10000'>" + msgDom + "</div>");
            }
        }

        $(window).resize(function () {
            __loadNodes();
        });

        return this;
    };

})(jQuery);