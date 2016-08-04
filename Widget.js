///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
        'dojo/_base/html',
        'dojo/query',
        'dijit/_WidgetsInTemplateMixin',
        'jimu/BaseWidget',
        'esri/geometry/webMercatorUtils',
        'dojo/request',
        "esri/symbols/SimpleMarkerSymbol",
        "esri/graphic",
        "esri/Color",
        "dojo/domReady!"
    ],
    function (declare, html, query, _WidgetsInTemplateMixin, BaseWidget, webMercatorUtils, request, SimpleMarkerSymbol, Graphic, Color) {
        var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
            baseClass: 'jimu-widget-about',
            name: "TopPlaceLocationScore",
            writelog: function (log, arguments) {
                console.log(log, arguments);
            },

            postCreate: function () {
                this.inherited(arguments);

                //this._hasContent = this.config.about && this.config.about.aboutContent;
            },

            startup: function () {
                this.inherited(arguments);

                //var map = this.map;


                //this.resize();
            },
            onOpen: function () {
                this.writelog('TopPlace::onOpen', arguments);
                var conf = {
                    api_key: this.config.TPLS.params.api_key,
                    app_id: this.config.TPLS.params.app_id,
                    apiurl: this.config.TPLS.params.apiurl,
                    type: this.config.TPLS.params.type,
                    ln: this.config.TPLS.params.ln
                };
                var map = this.map;
                var markerSymbol = new SimpleMarkerSymbol();
                markerSymbol.setPath("M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z");
                markerSymbol.setColor(new Color("#00FFFF"));
                var currentMarker;
                this.ClickFunction = this.map.on("click", function (evt) {
                    var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                    if (currentMarker)
                        map.graphics.remove(currentMarker);
                    currentMarker = map.graphics.add(new Graphic(evt.mapPoint, markerSymbol));
                    var data = {
                        appid: conf.app_id,
                        appkey: conf.api_key,
                        type: conf.type,
                        ln: conf.ln,
                        pois: JSON.stringify([[0, mp.y.toFixed(6), mp.x.toFixed(6)]])
                    };
                    var url = conf.apiurl + '/v2/lsedata';
                    request.post(url, {
                        data: data,
                        headers: {
                            'X-Requested-With': null
                        },
                        handleAs: "json"
                    }).then(function (response) {
                        console.log(response);
                        if (response.code == 0) {
                            var data = response.data[0];
                            var html = "";//JSON.stringify(data);
                            if (data.Events) {
                                if (data.Rank.Sights) {
                                    html += "<p>" + (data.Rank.Sights / 10) + " for Sights</p>"
                                }
                                if (data.Rank.Eating) {
                                    html += "<p>" + (data.Rank.Eating / 10) + " for Eating</p>"
                                }
                                if (data.Rank.Shopping) {
                                    html += "<p>" + (data.Rank.Shopping / 10) + " for Shopping</p>"
                                }
                                if (data.Rank.Nightlife) {
                                    html += "<p>" + (data.Rank.Nightlife / 10) + " for Nightlife</p>"
                                }
                                html += "<p>Based on " + data.Events + " events</p>";


                            }
                            if (data.Venues) {
                                html += "<br><h4>Venues Near</h4>";
                                for (var v = 0; v < data.Venues.length; v++) {
                                    html += "<p>" + data.Venues[v].name + " (" + data.Venues[v].dis_km + " km) [" + data.Venues[v].rank + "]</p>";
                                }
                            }
                            //{"id":0,"Rank":{"Sights":54,"Eating":0,"Shopping":0,"Nightlife":0},"Events":364}
                            dojo.byId("tpls").innerHTML = html;
                        }
                    });


                });
            },
            onClose: function () {
                this.writelog('TopPlace::onClose', arguments);
                this.ClickFunction.remove();
            }
        });
        return clazz;
    });