<template>
  <div class="position-page">
    <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="300px" style="background-color: rgb(238, 241, 246);height:750px">
        <el-menu :unique-opened='false'>
        <div v-for="(item,index) in menuList" :key="index+''">
            <el-submenu :index="index+''">
                <template slot="title"><i class="el-icon-s-custom"></i>约定人{{index+1}}</template>
                <el-row :gutter="20">
                  <el-col :span="6"><div style="height:40px;line-height:40px">约定人:</div></el-col>
                  <el-col :span="18">
                      <el-input
                    placeholder="请输入姓名"
                    v-model="menuList[index].person"
                    clearable>
                    </el-input>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="6"><div style="height:40px;line-height:40px">出发地:</div></el-col>
                  <el-col :span="18">
                      <el-input
                        placeholder="请输入出发地"
                        v-model="menuList[index].position"
                        clearable>
                      </el-input>
                  </el-col>
                </el-row>


                <el-row :gutter="20">
                  <el-col :span="6"><div style="height:40px;line-height:40px">出发时间:</div></el-col>
                  <el-col :span="18">
                    <el-time-picker
                        v-model="menuList[index].startTime"
                        placeholder="任意时间点">
                    </el-time-picker>
                  </el-col>
                </el-row>
                    <!-- 约定人:
                    <el-input
                    placeholder="请输入姓名"
                    v-model="menuList[index].person"
                    clearable>
                    </el-input>
                    出发地:
                    <el-input
                    placeholder="请输入出发地"
                    v-model="menuList[index].position"
                    clearable>
                    </el-input>
                    出发时间:
                    <el-time-picker
                        v-model="menuList[index].startTime"
                        placeholder="任意时间点">
                    </el-time-picker> -->
                    <!-- <el-button type="danger" icon="el-icon-remove-outline" circle @click="delMenu(index)"></el-button> -->
                    <div style="text-align: right; ">
                         <i class="el-icon-error" style="font-size: 25px;cursor:pointer" @click="delMenu(index)"></i>
                    </div>
                    <!-- <el-button type="primary" icon="el-icon-delete"></el-button> -->

               
            </el-submenu>
        </div>
            <el-divider><i class="el-icon-sunrise-1"></i></el-divider>
        <div>

          <el-row :gutter="20">
          <el-col :span="10"><div style="height:40px;line-height:40px">约定时间范围:</div></el-col>
            <el-col :span="18"> 
              <!-- <el-time-picker
                  v-model="sTime"
                  placeholder="任意时间点">
              </el-time-picker> -->
            </el-col>
          </el-row>


        <el-row :gutter="2">
          <!-- <el-col :span="10"><div style="height:40px;line-height:40px">约定结束时间:</div></el-col> -->
            <el-col :span="10"> 
              <el-time-picker
              style="width:120px"
                  v-model="eTime"
                  placeholder="起始时间">
              </el-time-picker>
            </el-col>
            <el-col :span="3" style="line-height:40px">至</el-col>
            <!-- </el-row>
            <el-row > 至 </el-row>
          <el-row> -->
            <el-col :span="10"> 
              <el-time-picker
              style="width:120px"
                  v-model="eTime"
                  minTime: startTime
                  placeholder="结束时间">
              </el-time-picker>
            </el-col>
          </el-row>
        <!-- 约定起始时间:
        <el-time-picker
            v-model="sTime"
            placeholder="任意时间点">
        </el-time-picker> 
        约定终止时间:
        <el-time-picker
            v-model="eTime"
            placeholder="任意时间点">
        </el-time-picker>
        -->
        
      <el-row style="margin-top:20px">
          <el-button  type="success" size="small" @click="addMenu()">增加新约定人</el-button>        
          <!-- <el-button type="primary" icon="el-icon-minus" @click="delMenu()"></el-button> -->
          <el-button type="info" size="small"  @click="handleData()">查看可达区域</el-button>  
      </el-row>
      <el-row style="margin-top:20px">          
          <el-button type="danger" size="small"  @click="reView()">重新查看区域</el-button>        
          <!-- <el-button type="primary" icon="el-icon-minus" @click="bindE()">绑定路线</el-button>
          <el-button type="primary" icon="el-icon-minus" @click="reomveE()">解除绑定</el-button> -->
          <el-button type="primary" size="small"  @click="addRoad()">智能规划道路</el-button>
      </el-row>  
        </div>
        </el-menu>
    </el-aside>
    
    <el-container>
        <el-header style="text-align: right; font-size: 12px">
          {{title}}
        <el-dropdown  @command = "handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='驾车'>驾车</el-dropdown-item>
            <el-dropdown-item command='步行'> 步行</el-dropdown-item>
            <el-dropdown-item command='骑行'>骑行</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span>切换行动方式</span>
        </el-header>
        
        <el-main style="height:750px">
          <!-- <div class="suggest"> -->

            <suggest-head></suggest-head>
            <autocomplete-list></autocomplete-list>
            <div class="map" >
                <amap ref="amap"></amap>
            </div>  
          <!-- </div> -->
        </el-main>
        <suggestList></suggestList>


    </el-container>
    </el-container>
  </div>
</template>
<script>
  import vForm from '@/components/public/Form.vue'
  import vButton from '@/components/public/Button.vue'
  import {mapState, mapActions} from 'vuex'
  import suggest from '../suggest/suggest.vue'
  import amap from '@/components/public/amap.vue'
  import suggestHead from '@/components/suggest/suggestHead.vue'
  import autocompleteList from '@/components/suggest/autocompleteList.vue'
  import suggestList from '@/components/suggest/suggestList.vue'
  export default {
    computed: {
      ...mapState([
        'position',
        'islogined',
        'address'
      ]),
      ...mapActions([
        'get_telephone'
      ])
    },
    components: {
      vForm,
      vButton,
      suggest,
      amap,
      suggestHead,
      autocompleteList,
      suggestList
    },
  
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        title:'驾车',
        selfLngLat:[],
        tableData: Array(20).fill(item),
        sTime: new Date(2018, 9, 10, 0, 0),
        // sTime:'',
        eTime: new Date(2018, 9, 10, 0, 0),
        menuList:[
            {
                person:'',
                position:'',
                startTime:new Date(2018, 9, 10, 0, 0),
                endTime:'',
                LngLat:[]

            },
                        {
                person:'',
                position:'',
                startTime:new Date(2018, 9, 10, 0, 0),
                endTime:'',
                LngLat:[]

            }
        ]

      }
    },
    created(){
        // self = this,
        console.log(this.position)
        // debugger;
        // this.getMarker()
    },
    mounted(){
        // this.get_telephone();
    },
    methods: {
      order () {
        console.log(this.address.start || this.position.address, this.address.end)
        if (this.address.start || this.position.address && this.address.end && this.islogined) {
          this.$router.push({path: 'order/loader'})
        } else if (!this.islogined) {
          this.$store.dispatch('telephone_input')
        }
      },
      addMenu(){
          this.menuList.push({
                person:'',
                position:'',
                startTime:new Date(2018, 9, 10, 0, 0),
                endTime:'',
                LngLat:[]
          });
      },
      delMenu(index){
        if(this.menuList.length>2){
          this.menuList.splice(index, 1);
        }else{
          this.$message.error("删除失败,约定人数至少为两人");
        }
      },
      

      handleCommand(command){
          this.title = command;
          console.log(command);
      },

      handleDate(time){

        let sTimeDiff = parseInt(this.sTime - time) / 1000;
        let eTimeDiff = parseInt(this.eTime - time) / 1000
        let v = 0;
        if(this.title == '驾车'){
           v = 3.854823;
        }
        if(this.title == '步行'){
           v = 0.7851325;
        }
        if(this.title == '骑行'){
           v = 1.8165321;
        }

        let rs = sTimeDiff*v;
        let re = eTimeDiff*v;       
        return {rs,re};
        
      },


      
      handleData(){

          console.log(this.menuList);

          this.menuList.forEach(menu => {
            let time = this.handleDate(menu.startTime);
            //  debugger;

            this.getLngLat(menu);
            

            this.getMarker(menu.person,menu.position,time.rs,time.re);

          });
          console.log(this.menuList);


      },

      getLngLat(menu){
        // debugger;
            AMap.plugin('AMap.Geocoder', ()=> {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 
              
                city: this.position.city
            })

            geocoder.getLocation(menu.position, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                    // debugger;
                    // console.log(result);
                    menu.LngLat = [result.geocodes[0].location.lng,result.geocodes[0].location.lat];
                    
                }
            })
        })      
        
      },


      getMarker(per,pos,rs,re){
          AMap.plugin('AMap.Geocoder', ()=> {
            var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: this.position.city
            })

            geocoder.getLocation(pos, (status, result)=> {
                if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                    // debugger;
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(result.geocodes[0].location.lng,  result.geocodes[0].location.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        title: per
                    });
                    console.log(marker);
                    console.log(result);
                    this.$refs.amap.addMark(marker,per,rs,re);
                    // self.$refs.amap.addRoad();

                }
            })
        })
      },

      reView(){
          this.$refs.amap.removeMark();
      },


      bindE(){
        debugger;
        // self.$refs.amap.bindEvent();
        this.$refs.amap.bindEvent();
        // console.log(e.lnglat);
      },
      reomveE(){
        this.$refs.amap.removeEvent();
      },

      addRoad(){
        this.menuList.forEach(menu =>{  
          if(this.title == '驾车'){
            this.$refs.amap.addRoad(menu.LngLat);
          }
          if(this.title == '步行'){
            this.$refs.amap.addWalkRoad(menu.LngLat);
          }
          if(this.title == '骑行'){
            this.$refs.amap.addRideRoad(menu.LngLat);
          }
          

        })  
      // self.$refs.amap.testThis();

      },



      mapCode(){
        AMap.plugin('AMap.Geocoder', ()=> {
        var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: '010'
        })

        geocoder.getLocation('东北大学', (status, result)=> {
            if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
                    console.log(result);
                    // debugger;
                    var marker = new AMap.Marker({
                        position: new AMap.LngLat(result.geocodes[0].location.lng,  result.geocodes[0].location.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        title: '东北大学'
                    });
                    // console.log(self.$refs);
                    this.$refs.amap.addMark(marker);
                    // self.$refs.amap.map.addMark();
            }
        })
        })

    },
    }
  }
</script>
<style>
  .position-page {
    position: absolute;
    padding: 10px;
    width: 100%;
    top: 54px;
    bottom: 0;
    box-sizing: border-box;
    overflow: auto;
    font-size: 12px;
    z-index: 999;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .map{
  height: 85%;
  width: 76%;
  position: absolute;
  /* z-index: 800; */
  /*background-color: green;*/
  }

  /* .button-group{

  } */
  
</style>
