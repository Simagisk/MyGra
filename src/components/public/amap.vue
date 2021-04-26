<template>
  <div id="container" ref="map">
  <div id="panel"></div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        map: {},
        e:{},
        clickListener:{},
        LngLat:{}
      }
    },

  methods: {
    createMap() {
      var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 10
      })
      this.$store.dispatch('getCurrentPosition', map)
      this.map = map;
    },

    addMarkDemo(lng,lat,title){
      var marker =  new AMap.Marker({
          position:  new AMap.LngLat(lng, lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: title
      });

      // 将创建的点标记添加到已有的地图实例：
      this.map.add(marker);

    },
    //添加事件
    addlnglat(){
      var clickHandler = function(e) {
        console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        this.e = e;
      };
      // debugger;
      // 绑定事件
      this.map.on('click', clickHandler);
    },

    testThis(){
      console.log(this.LngLat);
    },

    //添加道路
    addRoad(start){
      // debugger;
      var end = this.LngLat;
      var map = this.map;
      AMap.plugin('AMap.Driving', ()=> {
        
        // debugger;
        var driving = new AMap.Driving({
            map: map,
            panel: "panel"
        }); 
        var drivingOption = {
            policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
            ferry: 1, // 是否可以使用轮渡
            province: '京', // 车牌省份的汉字缩写  
        }

        // 构造路线导航类
        var driving = new AMap.Driving(drivingOption)

        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(start[0], start[1]), new AMap.LngLat(end[0], end[1]), function(status, result) {
            // result即是对应的驾车导航信息，相关数据结构文档请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === 'complete') {
                if (result.routes && result.routes.length) {
                    // 绘制第一条路线，也可以按需求绘制其它几条路线
                    drawRoute(result.routes[0])
                    console.log('绘制驾车路线完成')
                }
            } else {
                console.log('获取驾车数据失败：' + result)
            }
        });

        function drawRoute (route) {
            var path = parseRouteToPath(route)

            var startMarker = new AMap.Marker({
                position: path[0],
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                map: map
            })

            var endMarker = new AMap.Marker({
                position: path[path.length - 1],
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                map: map
            })

            var routeLine = new AMap.Polyline({
                path: path,
                isOutline: true,
                outlineColor: '#ffeeee',
                borderWeight: 2,
                strokeWeight: 5,
                strokeColor: '#0091ff',
                lineJoin: 'round'
            })

            routeLine.setMap(map)

            // 调整视野达到最佳显示区域
            map.setFitView([ startMarker, endMarker, routeLine ])
        }

        // 解析DrivingRoute对象，构造成AMap.Polyline的path参数需要的格式
        // DrivingResult对象结构参考文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DriveRoute
        function parseRouteToPath(route) {
            var path = []

            for (var i = 0, l = route.steps.length; i < l; i++) {
                var step = route.steps[i]

                for (var j = 0, n = step.path.length; j < n; j++) {
                  path.push(step.path[j])
                }
            }

            return path
        }


      })
    },



    addWalkRoad(start){
    var end = this.LngLat;
    var map = this.map;
    AMap.plugin('AMap.Walking', ()=> {
    var walkingOption = {}

    // 步行导航
    var walking = new AMap.Walking(walkingOption)
    //根据起终点坐标规划步行路线
    walking.search([start[0], start[1]], [end[0], end[1]], function(status, result) {
        // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
                console.log('绘制步行路线完成')
            }
        } else {
            console.log('步行路线数据查询失败' + result)
        } 
    });

    function drawRoute (route) {
        var path = parseRouteToPath(route)

        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
        })

        routeLine.setMap(map)

        // 调整视野达到最佳显示区域
        map.setFitView([ startMarker, endMarker, routeLine ])
    }

    // 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
    // WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
    function parseRouteToPath(route) {
        var path = []

        for (var i = 0, l = route.steps.length; i < l; i++) {
            var step = route.steps[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }

        return path
      }
      })
    },
    
    bindEvent(){
      // debugger;
        this.removeEvent(); //防止重复绑定
        this.clickListener = AMap.event.addListener(this.map, "click", function(e) {
            this.LngLat = e.lnglat;
            console.log(this.LngLat);
            // debugger;
            
            // this.e = e;
            
        });
    },

    addRideRoad(start){
    var end = this.LngLat;
    var map = this.map;
    AMap.plugin('AMap.Riding', ()=> {
    var ridingOption = {
      policy: 1  
    }



     var riding = new AMap.Riding(ridingOption)

    //根据起终点坐标规划骑行路线
    riding.search([start[0],start[1]],[end[0],end[1]], function(status, result) {
        // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
        if (status === 'complete') {

            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
                console.log('绘制骑行路线完成')
            }
        } else {
            console.log('骑行路线数据查询失败' + result)
        }
    });

    function drawRoute (route) {
        var path = parseRouteToPath(route)

        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
        })

        routeLine.setMap(map)

        // 调整视野达到最佳显示区域
        map.setFitView([ startMarker, endMarker, routeLine ])
    }

    // 解析RidingRoute对象，构造成AMap.Polyline的path参数需要的格式
    // RidingResult对象结构参考文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_RideRoute
    function parseRouteToPath(route) {
        var path = []

        for (var i = 0, l = route.rides.length; i < l; i++) {
            var step = route.rides[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }

        return path
    }
       })
    },


    removeEvent(){
        if (this.clickListener) {
            AMap.event.removeListener(this.clickListener);//移除事件，以绑定时返回的对象作为参数
        }
    },

    showInfoC(e){
        this.LngLat = [e.lnglat.getLng(),e.lnglat.getLat()];
        console.log(this.LngLat);
    },


    removeMark(){
      this.map.clearMap();
    },


    //添加图标
    addMark(marker,per,rs,re){
      // debugger;
      // var marker =  new AMap.Marker({
      //     position:  new AMap.LngLat(lng, lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //     title: title
      // });
      // 将创建的点标记添加到已有的地图实例：
      
      var circleS = new AMap.Circle({
          center: new AMap.LngLat(marker.G.position.lng,marker.G.position.lat),  // 圆心位置
          radius: rs, // 圆半径
          fillColor: '#778899',   // 圆形填充颜色
          strokeColor: '#fff', // 描边颜色
          strokeWeight: 2, // 描边宽度
          fillOpacity: 0.4, //设置透明度
          zIndex: 12,  //设置高度
      });

      var circleE = new AMap.Circle({
          center: new AMap.LngLat(marker.G.position.lng,marker.G.position.lat),  // 圆心位置
          radius: re, // 圆半径
          fillColor: '#B0E0E6',   // 圆形填充颜色
          strokeColor: '#fff', // 描边颜色
          strokeWeight: 2, // 描边宽度
          fillOpacity: 0.3, //设置透明度
          zIndex: 11,  //设置高度
      });

    


      let LngLat;

      function showInfoC(e){
          // var text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置点击了圆！'
          // document.querySelector("#text").innerText = text;
          // console.log(text);
          LngLat=[e.lnglat.getLng(),e.lnglat.getLat()];
          // getLngLat = function () {
          //     return LngLat;
          // };
          console.log(LngLat);
          // setLngLat(LngLat);
          // callBack(LngLat);
      }
      // self = this;
    
      // var lnglat =getLngLat() ;
      // this.LngLat = lnglat;
      circleS.on('click',this.showInfoC);
      circleE.on('click',this.showInfoC);
      this.map.add(circleE);
      this.map.add(circleS);

      // var map = this.map;



      // AMap.plugin('AMap.CircleEditor', function() {
      //   var circleEditorS = new AMap.CircleEditor(map, circleS);
      //   var circleEditorE = new AMap.CircleEditor(map, circleE);

      //   circleEditorS.open();
      //   circleEditorE.open();
      //   circleEditorS.on('click', function(event) {
      //       console.log(event);
      //   })


      //   circleEditorE.on('click', function(event) {
      //       console.log(event);
      //   })

      // });
      


      this.map.add(marker,per);
         marker.setLabel({
            offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
            content: per, //设置文本标注内容
            direction: 'right' //设置文本标注方位
        });
      this.map.setFitView();

    }


  },
  created(){
    // self = this
  },
  mounted() {
    this.createMap()
    // this.addlnglat()
    // this.bindEvent()
    // this.removeEvent()
    
  }
}
// export default {
//   methods: {
//     location() {
//       console.log('map')
//       var map = new AMap.Map('container', {
//         resizeEnable: true,
//         zoom: 12,
//         center: [116.480983, 40.0958]
//       })
//     }
//   },
//   mounted() {
//     this.$store.dispatch('get_location2',this.$refs.map.id)
//   }
// }
</script>
  <style>
#container {
  height: 100%;
}
</style>
