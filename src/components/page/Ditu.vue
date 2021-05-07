<template>
    <div style="width: 100%; height: 100%">
        <!-- <div ref="map" class="map" id="all-map"></div> -->
        <div class="map" id="allmap"></div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            shebei: [],
            options: [],
            value: '',
            accessKey: ''
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.accessKey = data.user.accessKey;
        // this.getList();
    },
    mounted() {
        this.getList();
        // this.getpoluline();
        // this.TencentMap();
    },
    methods: {
        async getList() {
            var map = new BMap.Map('allmap', { mapType: BMAP_HYBRID_MAP }); // 创建地图实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 6);
            map.enableScrollWheelZoom(true);

            var data_info = [];
            var data = [];
            var res = await this.$http.post('project/getList', { accessKey: this.accessKey });
            var res1 = res.data.response;
            for (var i in res1) {
                if (res1[i].censored == 1) {
                    data.push(res1[i]);
                }
            }
            for (var i in data) {
                let lng = data[i].longitude;
                let lat = data[i].latitude;
                data_info.push([lng, lat, data[i]]);
            }

            var opts = {
                width: 250, // 信息窗口宽度
                enableMessage: true //设置允许信息窗发送短息
            };
            for (var i = 0; i < data_info.length; i++) {
                var time = data[i].startTime.substring(0, 4) - 0;
                var year = new Date().getFullYear() - 0;
                var myIcon;
                if (year - time == 0) {
                    myIcon = new BMap.Icon('http://123.127.160.69:8080/examples/planer.png', new BMap.Size(32, 32));
                } else if (year - time <= 2) {
                    myIcon = new BMap.Icon('http://123.127.160.69:8080/examples/planey.png', new BMap.Size(32, 32));
                } else {
                    myIcon = new BMap.Icon('http://123.127.160.69:8080/examples/planeg.png', new BMap.Size(32, 32));
                }
                var marker = new BMap.Marker(new BMap.Point(data_info[i][0], data_info[i][1]), {
                    icon: myIcon
                }); // 创建标注
                var content =
                    `<h5 style='margin-bottom:10px'> 项目名称： ` +
                    data[i].name +
                    `</h5>` +
                    `<h5 style='margin-bottom:10px'> 开始时间： ` +
                    data[i].startTime +
                    `</h5>` +
                    `<h5 style='margin-bottom:10px'> 结束时间： ` +
                    data[i].endTime +
                    `</h5>` +
                    `<h5 style='margin-bottom:10px'> 实施地点： ` +
                    data[i].serviceAddress +
                    `</h5>` +
                    `<h5 style='margin-bottom:10px'> 施药量 ：` +
                    data[i].appicationRate +
                    '升/公顷' +
                    `</h5>` +
                    `<h5 style='margin-bottom:10px'> 合同面积： ` +
                    data[i].areaInContract +
                    '亩' +
                    `</h5>`;
                map.addOverlay(marker); // 将标注添加到地图中
                addClickHandler(content, marker);
            }
            function addClickHandler(content, marker) {
                marker.addEventListener('click', function (e) {
                    openInfo(content, e);
                });
            }
            function openInfo(content, e) {
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            }
        },

        async getpoluline(e) {
            var res = await this.$http.post('data/getEquipments', { accessKey: this.accessKey });
            var data = res.data.response;
            var map = new AMap.Map('all-map', {
                center: [116.397428, 39.90923], // [纬度，经度]
                resizeEnable: true,
                zoom: 5
            });
            map.addControl(
                new AMap.MapType({
                    defaultType: 1 //0代表默认，1代表卫星
                })
            );
            AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
                var layerCtrl = new BasicControl.LayerSwitcher({
                    //my-red 见上方style
                    theme: 'my-red',
                    position: 'tr'
                });

                map.addControl(layerCtrl);
            });
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                map.addControl(new AMap.ToolBar());
                map.addControl(new AMap.Scale());
            });

            for (var i = 0; i <= data.length; i++) {
                await this.$http.post('data/getTraceByEquipment', { accessKey: this.accessKey, equipmentID: data[i] }).then((res) => {
                    var data = res.data.response;
                    for (var i in data) {
                        var path = [];
                        for (var j in data[i].list) {
                            let lat = data[i].list[j].x;
                            let lng = data[i].list[j].y;
                            path.push([lat, lng]);
                        }
                        var polyline = new AMap.Polyline({
                            path: path,
                            isOutline: true,
                            outlineColor: 'red',
                            borderWeight: 1,
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 1,
                            // 折线样式还支持 'dashed'
                            strokeStyle: 'solid',
                            // strokeStyle是dashed时有效
                            strokeDasharray: [10, 5],
                            lineJoin: 'round',
                            lineCap: 'round',
                            zIndex: 50
                        });
                        polyline.setMap(map);
                    }
                });
            }
        }
    }
};
</script>
<style>
.map {
    width: 100%;
    height: 100%;
}
</style>
