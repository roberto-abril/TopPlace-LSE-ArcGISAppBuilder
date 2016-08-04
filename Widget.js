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
    'dojo/request'
],
  function(declare, html, query, _WidgetsInTemplateMixin, BaseWidget,webMercatorUtils,request) {
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-about',
      name:"TopPlaceLocationScore",
      writelog :function(log,arguments){
        console.log(log, arguments);
      },

      postCreate: function() {
        this.inherited(arguments);

        //this._hasContent = this.config.about && this.config.about.aboutContent;
      },

      startup: function() {
        this.inherited(arguments);

        //var map = this.map;


        //this.resize();
      },
      onOpen: function() {
        this.writelog('TopPlace::onOpen', arguments);
        var conf = {
            api_key : this.config.TPLS.params.api_key,
            app_id :this.config.TPLS.params.app_id,
            apiurl : this.config.TPLS.params.apiurl,
            type :this.config.TPLS.params.type,
            ln : this.config.TPLS.params.ln,
        };
        //conf.apiurl = "http://localhost:7000";


        this.ClickFunction  = this.map.on("click", function(evt){
          //console.log(evt.mapPoint);
          var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
          var data = {
            appid: conf.app_id,
            appkey: conf.api_key,
            type:conf.type,
            ln:conf.ln,
            pois: JSON.stringify([[0, mp.y.toFixed(6),mp.x.toFixed(6)]])
          };
            var url = conf.apiurl+'/v2/lsedata';
            request.post(url, {
                data: data,
                headers: {
                    'X-Requested-With': null
                },
                handleAs: "json"
            }).then(function (response) {
                console.log(response);
                if(response.code ==0){
                    var data = response.data[0];
                    var html = "";//JSON.stringify(data);
                    if(data.Events) {
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
                    if(data.Venues){
                        html += "<br><h4>Venues Near</h4>";
                        for(var v=0;v < data.Venues.length; v++){
                            html += "<p>"+data.Venues[v].name+" ("+data.Venues[v].dis_km+" km) ["+data.Venues[v].rank+"]</p>";
                        }
                    }
                    //{"id":0,"Rank":{"Sights":54,"Eating":0,"Shopping":0,"Nightlife":0},"Events":364}
                    dojo.byId("tpls").innerHTML = html;
                }
            });


        });
      },
      onClose: function() {
        this.writelog('TopPlace::onClose', arguments);
        this.ClickFunction.remove();
      }
    });
    return clazz;
  });