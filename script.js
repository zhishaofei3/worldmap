// 基于准备好的dom，初始化echarts实例
const myChart = echarts.init(document.getElementById('world-map'));

// 显示加载动画
myChart.showLoading({
    text: 'Loading map data...',
    color: '#00d2ff',
    textColor: '#fff',
    maskColor: 'rgba(21, 38, 62, 0.8)'
});

// 城市坐标和模拟数据
// value 格式: [经度, 纬度, 访问量]
const cityData = [
    // United Kingdom
    { name: 'London', value: [-0.1278, 51.5074, 5200] },
    { name: 'Manchester', value: [-2.2426, 53.4808, 3800] },
    { name: 'Birmingham', value: [-1.8904, 52.4862, 3100] },
    { name: 'Edinburgh', value: [-3.1883, 55.9533, 2500] },
    { name: 'Glasgow', value: [-4.2518, 55.8642, 2200] },
    { name: 'Liverpool', value: [-2.9916, 53.4084, 2000] },

    // France
    { name: 'Paris', value: [2.3522, 48.8566, 4800] },
    { name: 'Lyon', value: [4.8357, 45.7640, 2700] },
    { name: 'Marseille', value: [5.3698, 43.2965, 2400] },
    { name: 'Toulouse', value: [1.4442, 43.6047, 1900] },
    { name: 'Nice', value: [7.2620, 43.7102, 1800] },
    { name: 'Bordeaux', value: [-0.5792, 44.8378, 1700] },

    // Germany
    { name: 'Berlin', value: [13.4050, 52.5200, 3500] },
    { name: 'Munich', value: [11.5820, 48.1351, 3200] },
    { name: 'Hamburg', value: [9.9937, 53.5511, 3000] },
    { name: 'Frankfurt', value: [8.6821, 50.1109, 2800] },
    { name: 'Cologne', value: [6.9603, 50.9375, 2600] },
    { name: 'Stuttgart', value: [9.1829, 48.7758, 2100] },

    // Netherlands
    { name: 'Amsterdam', value: [4.8952, 52.3702, 2800] },
    { name: 'Rotterdam', value: [4.4777, 51.9244, 2300] },
    { name: 'The Hague', value: [4.3007, 52.0705, 1900] },
    { name: 'Utrecht', value: [5.1214, 52.0907, 1600] },
    { name: 'Eindhoven', value: [5.4697, 51.4416, 1400] },

    // Other Europe
    { name: 'Rome', value: [12.4964, 41.9028, 3200] },
    { name: 'Madrid', value: [-3.7038, 40.4168, 3100] },
    { name: 'Moscow', value: [37.6173, 55.7558, 2500] },
    { name: 'Vienna', value: [16.3738, 48.2082, 2100] },
    { name: 'Stockholm', value: [18.0686, 59.3293, 1900] },
    { name: 'Prague', value: [14.4378, 50.0755, 1800] },
    { name: 'Warsaw', value: [21.0122, 52.2297, 1600] },
    { name: 'Dublin', value: [-6.2603, 53.3498, 1500] },
    { name: 'Zurich', value: [8.5417, 47.3769, 2200] },
    
    // Asia
    { name: 'Beijing', value: [116.4074, 39.9042, 1200] },
    { name: 'Tokyo', value: [139.6917, 35.6895, 1500] },
    { name: 'Singapore', value: [103.8198, 1.3521, 900] },
    { name: 'Bangkok', value: [100.5018, 13.7563, 800] },
    { name: 'Seoul', value: [126.9780, 37.5665, 850] },
    { name: 'Dubai', value: [55.2708, 25.2048, 950] }
];

// 获取地图数据
fetch('./world.json')
    .then(response => response.json())
    .then(geoJson => {
        myChart.hideLoading();

        // 注册地图
        echarts.registerMap('world', geoJson);

        const option = {
            backgroundColor: '#15263e',
            title: {
                text: 'User Traffic Source - TOP Cities',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(50, 50, 50, 0.7)',
                borderColor: '#00d2ff',
                textStyle: {
                    color: '#fff'
                },
                formatter: function (params) {
                    if (params.seriesType === 'effectScatter') {
                        return `${params.marker} <b>${params.name}</b><br/>Visits: ${params.value[2]}`;
                    }
                    return params.name;
                }
            },
            geo: {
                map: 'world',
                roam: true, // 开启鼠标缩放和平移
                zoom: 1.2,
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        areaColor: '#2a333d'
                    }
                },
                itemStyle: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                }
            },
            series: [
                {
                    name: 'Visits',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: cityData,
                    symbolSize: function (val) {
                        // 根据访问量调整点的大小，最小5，最大25
                        return Math.max(val[2] / 200, 5);
                    },
                    encode: {
                        value: 2
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    itemStyle: {
                        color: '#00d2ff',
                        shadowBlur: 10,
                        shadowColor: '#333'
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    zlevel: 1
                }
            ]
        };

        myChart.setOption(option);
    })
    .catch(error => {
        myChart.hideLoading();
        console.error('Map loading failed:', error);
        alert('Failed to load map data. Please check network connection or CORS settings.');
    });

// 响应式调整
window.addEventListener('resize', function () {
    myChart.resize();
});

