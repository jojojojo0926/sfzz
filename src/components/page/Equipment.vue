<template>
    <div style="width: 100%; height: 100%">
        <div ref="map" class="map" id="all-map"></div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {};
    },
    created() {},
    mounted() {
        var id = this.$route.query.equipmentID;
        var key = this.$route.query.accessKey;
        this.getpoluline(key, id);
    },
    methods: {
        async getpoluline(key, id) {
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
            await this.$http.post('data/getTraceByEquipment', { accessKey: key, equipmentID: id }).then((res) => {
                var data = res.data.response;
                if (res.data.message == '项目与设备未关联，请检查输入项') {
                    return this.$message.error(res.data.message);
                }
                
                var lineArr = [];

                for (var i in data) {
                    var path = [];
                    for (var j in data[i].list) {
                        lineArr.push(data[i].list[j])
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
};
</script>
<style>
.map {
    width: 100%;
    height: 100%;
}
.lh32 {
    line-height: 32px;
}
.mb10 {
    margin-bottom: 20px;
}
</style>
