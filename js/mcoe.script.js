// Angular Scripts //------------------------------------ //
// Application Module
var app = angular.module("app", ['countTo']);

// HTTP Factory Service
app.factory('httpService', function ($http) {

    return {

        getData: function (postData, fromDev, callback) {

            var PostJson = {};
            PostJson.serviceURL = postData;
            PostJson.fromDev = fromDev;
            return $http({

                method: "POST",
                async: true,
                url: "/AjaxCaller.aspx/ProxyGetMethod",
                data: JSON.stringify(PostJson)

            }).success(callback);

        }

    };

});



// GLOBAL CONTROLLER //---------------------------------- //

// Application Controller
app.controller("appCtrl", function ($scope) { });

// INCIDENT CONTROLLER //---------------------------------- //

//MCOE DASHBOARD API
//Priority 1 & 2 Open Incidents to plot in Map:

incident_dataCurrentlyOpenMap = "table/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5EstateNOT%20IN4%2C9%2C8%5EpriorityIN1%2C2&sysparm_display_value=true&sysparm_fields=number%2Cpriority%2Clocation%2Clocation.latitude%2Clocation.longitude%2Cshort_description%2Ccomments_and_work_notes%2Ccmdb_ci%2Csys_created_on%2Csys_id&sysparm_limit=10";

// Incident Count by Region
// For Present Year
//incident_countByRegion = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Eopened_atONLast%20year%40javascript%3Ags.beginningOfThisYear()%40javascript%3Ags.endOfThisYear()%5EpriorityIN1%2C2%5Estate!%3D9&sysparm_count=true&sysparm_group_by=priority%2Cu_affected_site.u_region";
// For Last Year
//incident_countByRegion = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Eopened_atONLast%20year%40javascript%3Ags.beginningOfLastYear()%40javascript%3Ags.endOfLastYear()%5EpriorityIN1%2C2%5Estate!%3D9&sysparm_count=true&sysparm_group_by=priority%2Cu_affected_site.u_region";
// For Last 12 Months
incident_countByRegion = "stats/incident?sysparm_query=assignment_group=365c07ef0fdb9100f7689bd692050e46^opened_atONLast%2012%20months@javascript:gs.monthsAgoStart(11)@javascript:gs.endOfThisMonth()^priorityIN1,2^state!=9&sysparm_count=true&sysparm_group_by=priority,u_affected_site.u_region"

// Incident Count by Group
//For last month
//incident_countByGroup = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5Eopened_atONLast%20month%40javascript%3Ags.beginningOfLastMonth()%40javascript%3Ags.endOfLastMonth()%5EpriorityIN1%2C2&sysparm_count=true&sysparm_group_by=cmdb_ci%2Cpriority&sysparm_display_value=true";
//For Current Month
incident_countByGroup = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5Eopened_atONLast%20month%40javascript%3Ags.beginningOfThisMonth()%40javascript%3Ags.endOfThisMonth()%5EpriorityIN1%2C2&sysparm_count=true&sysparm_group_by=cmdb_ci%2Cpriority&sysparm_display_value=true";
// Incident Count This Month
incident_countThisMonth = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5Eopened_atONLast%20month%40javascript%3Ags.beginningOfThisMonth()%40javascript%3Ags.endOfThisMonth()%5EpriorityIN1%2C2&sysparm_count=true&sysparm_group_by=priority";
//incident_countThisMonth = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5Eopened_atONLast%20month%40javascript%3Ags.beginningOfLastMonth()%40javascript%3Ags.endOfLastMonth()%5EpriorityIN1%2C2&sysparm_count=true&sysparm_group_by=priority";
// Incident Count Per Month
//incident_countPerMonth = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5EpriorityIN1%2C2%5Eopened_atONLast%20year%40javascript%3Ags.beginningOfLastYear()%40javascript%3Ags.endOfLastYear()&sysparm_count=true&sysparm_group_by=priority%2Cu_month";
//incident_countPerMonth = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5EpriorityIN1%2C2%5Eopened_atONLast%2012%20months@javascript:gs.monthsAgoStart(12)@javascript:gs.endOfThisMonth()%20&sysparm_count=true&sysparm_group_by=priority%2Cu_month";
//Last 12 months
incident_countPerMonth = "stats/incident?sysparm_query=assignment_group%3D365c07ef0fdb9100f7689bd692050e46%5Estate!%3D9%5EpriorityIN1%2C2%5Eopened_atONLast%2012%20months@javascript:gs.monthsAgoStart(11)@javascript:gs.endOfThisMonth()&sysparm_count=true&sysparm_group_by=priority%2Cu_month";





// Incident Controller //-------------------------------- //
app.controller("incidentCtrl", function ($scope, $timeout, httpService) {

    $scope.incidentInit = function () {
        //debugger;
        // Hide the page till data loaded
        $scope.isPageHide = false;
        $scope.isMapModalShow = false;
        $scope.options = {
            newPlots: {

            }
        };
        // Thresholds for Oldest Case Days
        $scope.oldestCaseTimeThresholdP1 = 0;
        $scope.oldestCaseTimeThresholdP2 = 0;
        // Threshold for Open Incidents
        $scope.openIncidentsThreshold = 10;

        $scope.hideMapModal = function () {
            $scope.isMapModalShow = false;
        };

        // Get Current Month
        $scope.getCurrentMonth = function () {
            var month = CurrentMonth();
            return month;
        };
        $scope.getCurrentYear = function () {
            var year = CurrentYear();
            return year;
        };


        // Incident Map ------------------------------------------ //
        //Priority 1 & 2 Open Incidents to plot in Map:

        httpService.getData(incident_dataCurrentlyOpenMap, false, onSuccessCurrentOpenMap);

        // On Success
        function onSuccessCurrentOpenMap(data) {

            // Get list of Incident with Location
            var incidentJSON = JSON.parse(data.d);
            // console.log(incidentJSON);

            // All Incidents
            $scope.incidentsv = incidentJSON.result;
            //  console.log($scope.incidentsv);

            $scope.incidentsP1 = [];
            $scope.incidentsP2 = [];

            refineMapData($scope.incidentsv, $scope.incidentsP1, $scope.incidentsP2);

            // console.log("Priority 1 Data: " + $scope.incidentsP1);
            // console.log("Priority 2 Data: " + $scope.incidentsP2);
            // Get the Oldest Case Days for Priority 1 Data
            $scope.oldestCaseTimeP1 = GetOldestCaseDays($scope.incidentsP1);
            $scope.oldestCaseUnitP1 = $scope.oldestCaseTimeP1 > 1 ? "days" : "day";
            $scope.oldestCaseTimeThresholdP1 = 5;

            // If Days is 0 then Get the Oldest Case Hours
            if ($scope.oldestCaseTimeP1 == 0) {
                $scope.oldestCaseTimeP1 = GetOldestCaseHours($scope.incidentsP1);
                $scope.oldestCaseUnitP1 = $scope.oldestCaseTimeP1 > 1 ? "hours" : "hour";
                $scope.oldestCaseTimeThresholdP1 = 5 * 60;
            }

            // If Hours is 0 then Get the Oldest Case Mins
            if ($scope.oldestCaseTimeP1 == 0) {
                $scope.oldestCaseTimeP1 = GetOldestCaseMins($scope.incidentsP1);
                $scope.oldestCaseUnitP1 = $scope.oldestCaseTimeP1 > 1 ? "mins" : "min";
                $scope.oldestCaseTimeThresholdP1 = 5 * 60 * 60;
            }


            // Get the Oldest Case Days for Priority 2 Data
            $scope.oldestCaseTimeP2 = GetOldestCaseDays($scope.incidentsP2);
            $scope.oldestCaseUnitP2 = $scope.oldestCaseTimeP2 > 1 ? "days" : "day";
            $scope.oldestCaseTimeThresholdP2 = 14;
            // If Days is 0 then Get the Oldest Case Hours
            if ($scope.oldestCaseTimeP2 == 0) {
                $scope.oldestCaseTimeP2 = GetOldestCaseHours($scope.incidentsP2);
                $scope.oldestCaseUnitP2 = $scope.oldestCaseTimeP2 > 1 ? "hours" : "hour";
                $scope.oldestCaseTimeThresholdP2 = 14 * 60;
            }

            // If Hours is 0 then Get the Oldest Case Mins
            if ($scope.oldestCaseTimeP2 == 0) {
                $scope.oldestCaseTimeP2 = GetOldestCaseMins($scope.incidentsP2);
                $scope.oldestCaseUnitP2 = $scope.oldestCaseTimeP2 > 1 ? "mins" : "min";
                $scope.oldestCaseTimeThresholdP2 = 14 * 60 * 60;
            }

            // Data Map Load
            DataLoader($scope.incidentsv);

            // Configure Map
            ConfigureIncidentMap();

            $scope.options.newPlots = arrayToObject(plotData);
            // Configure Map
            //ConfigureIncidentMap();

            $(".map-container").trigger('update', [$scope.options]);

        }


        // Incident Tile ------------------------------------------ //

        // Severity Closed this Year [Removed]

        // Monthly Incident Chart --------------------------------- //

        // Incidents In Current Month

        // HTTP Service Call
        httpService.getData(incident_countThisMonth, false, onSuccessIncidentCountThisMonth);

        // On Success
        function onSuccessIncidentCountThisMonth(data) {

            // Get Count of Incident per Month
            var countThisMonth = JSON.parse(data.d);

            $scope.incidentCountThisMonth = countThisMonth.result
            // console.log($scope.incidentCountThisMonth);
            if ($scope.incidentCountThisMonth.length == 2) {
                if ($scope.incidentCountThisMonth[0].groupby_fields[0].value == 1) {
                    $scope.incidentCountThisMonthP1 = $scope.incidentCountThisMonth[0].stats.count;
                    $scope.incidentCountThisMonthP2 = $scope.incidentCountThisMonth[1].stats.count;
                } else if ($scope.incidentCountThisMonth[0].groupby_fields[0].value == 2) {
                    $scope.incidentCountThisMonthP1 = $scope.incidentCountThisMonth[1].stats.count;
                    $scope.incidentCountThisMonthP2 = $scope.incidentCountThisMonth[0].stats.count;
                }
            } else {
                $scope.incidentCountThisMonthP1 = 0;
                $scope.incidentCountThisMonthP2 = 0;
            }

        }

        // Incidents Per Month

        // HTTP Service Call
        httpService.getData(incident_countPerMonth, false, onSuccessIncidentPerMonth);


        var incidentsMonthlyP1 = [];
        var incidentsMonthlyP2 = [];
        // On Success
        function onSuccessIncidentPerMonth(data) {

            // Get Count of Incident per Month
            var incidentsMonthlyJSON = JSON.parse(data.d);
            //console.log(monthJSON);



            refineMonthlyData(incidentsMonthlyJSON.result, incidentsMonthlyP1, incidentsMonthlyP2);
            // console.log("incidentsMonthlyP1: " + incidentsMonthlyP1);
            // console.log("incidentsMonthlyP2: " + incidentsMonthlyP2);

            incidentsMonthlyP1.sort(sortingComparingOnMonthNo);
            incidentsMonthlyP2.sort(sortingComparingOnMonthNo);

            console.log(incidentsMonthlyP1 + incidentsMonthlyP2);

            incidentsMonthlyP1 = reArrangementOfMonthlyData(incidentsMonthlyP1);
            incidentsMonthlyP2 = reArrangementOfMonthlyData(incidentsMonthlyP2);

            console.log(incidentsMonthlyP1 + incidentsMonthlyP2);

            console.log("incidentsMonthlyP1: " + incidentsMonthlyP1);
            console.log("incidentsMonthlyP2: " + incidentsMonthlyP2);

            // Average
            var avg1 = RenderIncidentChart(incidentsMonthlyP1);
            var avg2 = RenderIncidentChart(incidentsMonthlyP2);

            isNaN(avg1) ? $scope.avgMonthIncidentP1 = 0 : $scope.avgMonthIncidentP1 = avg1;
            isNaN(avg2) ? $scope.avgMonthIncidentP2 = 0 : $scope.avgMonthIncidentP2 = avg2;

        }

        // Region Incident Chart --------------------------------- //

        // HTTP Service Call
        httpService.getData(incident_countByRegion, false, onSuccessIncidentRegion);

        // On Success
        function onSuccessIncidentRegion(data) {

            // Get list of Incident with Location
            var regionJSON = JSON.parse(data.d);
            //console.log(regionJSON);

            $scope.incidentsRegion = regionJSON.result;

            var incidentsRegionP1 = [];
            var incidentsRegionP2 = [];

            refineRegionData($scope.incidentsRegion, incidentsRegionP1, incidentsRegionP2);

            // console.log("Region P1: " + incidentsRegionP1);
            // console.log("Region P2: " + incidentsRegionP2);

            // Render Region Chart
            $scope.incidentRegionShareP1 = RenderRegionChart(incidentsRegionP1);
            $scope.incidentRegionShareP2 = RenderRegionChart(incidentsRegionP2);

            

        }


        // Tower Incident Chart --------------------------------- //

        var towerYearData;
        var towerYearDataP1 = [];
        var towerYearDataP2 = [];

        // HTTP Service Call
        httpService.getData(incident_countByGroup, false, onSuccessIncidentTowerYear);

        // On Success
        function onSuccessIncidentTowerYear(data) {

            // Get list of Incident with Location
            var towerYearJSON = JSON.parse(data.d);
            //console.log(towerYearJSON);

            towerYearData = towerYearJSON.result;

            //  console.log(towerYearData);
            refineGroupData(towerYearData, towerYearDataP1, towerYearDataP2);

            //  console.log("towerYearDataP1: " + towerYearDataP1);
            //  console.log("towerYearDataP2: " + towerYearDataP2);

            // Only 5 Records
            //if (towerYearDataP1.length > 5)
            //    towerYearDataP1 = towerYearDataP1.slice(0, 5);

            // Only 5 Records
            //if (towerYearDataP2.length > 5)
            //    towerYearDataP2 = towerYearDataP2.slice(0, 5);

            // Page is available now after all ajax call complete
            console.log('Complete Loading');
            $scope.isPageHide = false;

            // Call Chart Renders
            chartRefereshInterval();

        }

        // Chart Caller //--------------------------------//
        $scope.isPriority1 = true;

        function chartRefereshInterval() {

            // Incident Tower Chart (Sev-1 / Sev-2)
            towerData = $scope.isPriority1 ? towerYearDataP1 : towerYearDataP2;



            if (towerData != undefined) {

                if (towerData.length == 0) {
                    $("#incidenttowerchart").text("No Incidents Reported Yet").css({
                        "text-align": "center", "font-size": "18px", "color": "red", "padding-top": "60px"
                    });
                }
                else {
                    // Tower Chart Render
                    IncidentTowerChart(towerData);
                }
            }

            // Incident Month Chart (Sev-1 / Sev-2)
            monthData = $scope.isPriority1 ? incidentsMonthlyP1 : incidentsMonthlyP2;

            if (monthData != undefined) {
                // Incident Chart Render
                RenderIncidentChart(monthData);
            }

            // Alter Chart
            $scope.isPriority1 = !$scope.isPriority1;

            // Slider 
            $('.carousel ').carousel();

            $timeout(chartRefereshInterval, 10000);

        }

        // Angular View Calling Functions

        // Days Diff
        $scope.GetDaysDiff = function (rawDate) {
            return GetDaysDiff(rawDate);
        }

        // Get Trim
        $scope.GetTrim = function (str) {
            if (str != undefined)
                return str.trim();
        }

        // View Data Modal
        $scope.ViewModal = function (viewIncident, className) {
            $scope.className = className;
            $scope.viewIncident = viewIncident;
        }
    }
});

// Get the Oldest Case Days
function GetOldestCaseDays(incidentData) {

    var maxDays = 0;

    for (i = 0; i < incidentData.length; i++) {

        var diffDays = GetDaysDiff(incidentData[i].sys_created_on);
        //console.log(diffDays);

        maxDays = diffDays > maxDays ? diffDays : maxDays;

    }
    //console.log(maxDays);

    return maxDays;
}

function GetDaysDiff(rawDate) {

    var oneDay = 24 * 60 * 60 * 1000;
    var currentSysDate = new Date();

    var incidentOpenedDate = new Date(rawDate);

    var diffDays = Math.floor(Math.abs((incidentOpenedDate.getTime() - currentSysDate.getTime()) / (oneDay)));

    return diffDays;
}

// Get the Oldest Case Hours
function GetOldestCaseHours(incidentData) {

    var maxHours = 0;

    for (i = 0; i < incidentData.length; i++) {

        var diffHours = GetHoursDiff(incidentData[i].sys_created_on);
        //console.log(diffDays);

        maxHours = diffHours > maxHours ? diffHours : maxHours;

    }
    //console.log(maxHours);

    return maxHours;
}

function GetHoursDiff(rawDate) {

    var oneHour = 60 * 60 * 1000;
    var currentSysDate = new Date();

    var incidentOpenedDate = new Date(rawDate);

    var diffHours = Math.floor(Math.abs((incidentOpenedDate.getTime() - currentSysDate.getTime()) / (oneHour)));

    return diffHours;
}

// Get the Oldest Case Mins
function GetOldestCaseMins(incidentData) {

    var maxMins = 0;

    for (i = 0; i < incidentData.length; i++) {

        var diffMins = GetMinsDiff(incidentData[i].sys_created_on);
        //console.log(diffDays);

        maxMins = diffMins > maxMins ? diffMins : maxMins;

    }
    //console.log(maxMins);

    return maxMins;
}

function GetMinsDiff(rawDate) {

    var oneMin = 60 * 1000;
    var currentSysDate = new Date();

    var incidentOpenedDate = new Date(rawDate);

    var diffMins = Math.floor(Math.abs((incidentOpenedDate.getTime() - currentSysDate.getTime()) / (oneMin)));

    return diffMins;
}

// Map Data
//var plotData = [];

//function DataLoader(mapData, flag) {

//    for (i = 0; i < mapData.length; i++) {
//        var item = {};
//        item["isMajor"] = flag;
//        //item["title"] = mapData[i].location.display_value;
//        item["title"] = mapData[i].u_affected_site.display_value;
//        item["latitude"] = mapData[i]['u_affected_site.latitude'];
//        item["longitude"] = mapData[i]['u_affected_site.longitude'];
//        plotData.push(item);
//    }
//    //console.log(plotData);

//}


// Method for Open Incidents ( Map Plots ) to refine Priority 1 and 2 data in seperate Array //Added By Rohtash

function refineMapData(mainArray, priority1Array, priority2Array) {

    for (i = 0; i < mainArray.length; i++) {

        var priority = parseInt(mainArray[i].priority);
        if (priority == 1)
            priority1Array.push(mainArray[i]);
        else if (priority == 2)
            priority2Array.push(mainArray[i]);
    }
}



var plotData = [];

var incidentArray = [];

/*var delhi = {
    value: 1,
    latitude:28,
    longitude: 27,
    tooltip: {content:"Delhi"}
};

plotData.push(delhi);*/

function DataLoader(mapData) {

    for (i = 0; i < mapData.length; i++) {
        var item = {
            value: 0,
            latitude: 0,
            longitude: 0,
            title: "",
            tooltip: {
                content: ""
            },
        };

        var incidentData = {
            number: "",
            location_name: "",
            priority: "",
            link: "",
            short_desc: "",
            assigned_to: ""

        };

        incidentData["number"] = mapData[i].number;
        incidentData["location_name"] = mapData[i].location.display_value;
        incidentData["priority"] = mapData[i].priority;
        incidentData["short_desc"] = mapData[i].short_description;
        incidentData["assigned_to"] = mapData[i].location.display_value;
        incidentArray.push(incidentData);

        item["value"] = parseInt(mapData[i].priority);
        item["title"] = mapData[i].location.display_value;
        item.title = mapData[i].number;
        item.tooltip.content = mapData[i].location.display_value; // Rohtash
        item["latitude"] = mapData[i]['location.latitude'];
        item["longitude"] = mapData[i]['location.longitude'];
        plotData.push(item);

    }
    //  console.log(incidentArray);

}


function ConfigureIncidentMap() {

    $(".map-container").mapael({
        map: {
            name: "world_countries"
            // Enable zoom on the map
                ,
            zoom: {
                enabled: true,
                mousewheel: true,
                touch: true,
                maxLevel: 50

            }
            // Set default plots and areas style
            ,
            defaultPlot: {
                attrs: {
                    fill: "#004a9b",
                    opacity: 0.6
                },
                attrsHover: {
                    opacity: 1,
                    transform: "s2"
                },
                text: {
                    attrs: {
                        fill: "#505444"
                    },
                    attrsHover: {
                        fill: "#000"
                    }
                },
                eventHandlers: {
                    click: function (e, id, mapElem, textElem, elemOptions) {
                        // console.log("Id: " + id);
                        //console.log("MapElem: " + mapElem);
                        // console.log("TextElem:"+textElem);
                        console.log("ElemOps:" + elemOptions);

                        var plotDetails = getDetails(incidentArray, elemOptions.title);

                        console.log(plotDetails);

                        $("#incidentTitle").html("<span style='font-weight:bold'>" + plotDetails.location_name + "</span>");
                        $("#incidentNumber").html("<span style='font-weight:bold'>Incident:</span> " + plotDetails.number);
                        $("#incidentLocation").html("<span style='font-weight:bold'>Location:</span> " + plotDetails.location_name);
                        $("#incidentPriority").html("<span style='font-weight:bold'>Priority:</span> " + plotDetails.priority);
                        $("#incidentDesc").html("<span style='font-weight:bold'>Description:</span> " + plotDetails.short_desc);

                        //$("#incidentNumber").text("Incident: " + plotDetails.number);
                        //$("#incidentLocation").text("Location: " + plotDetails.location_name);
                        //$("#incidentPriority").text("Priority: " + plotDetails.priority);
                        //$("#incidentDesc").text("Description: " + plotDetails.short_desc);
                        $('#mapModal').modal('show');


                    }
                }
            },
            defaultArea: {
                attrs: {
                    fill: "#f2f2f2" /*10876d*/,
                    stroke: "#383F47" /*17443b*/
                },
                attrsHover: {
                    fill: "#85A1B3"
                },
                text: {
                    attrs: {
                        fill: "#505444"
                    },
                    attrsHover: {
                        fill: "#000"
                    }
                },
                eventHandlers: {
                    click: function (event) {
                        $('#mapModal').modal('hide');
                    }
                }

            }
        },

        // Customize some areas of the map
        areas: {
            /* "IN": {
                 attrs: {
                     fill: "red"
                 }
                     , attrsHover: {
                         fill: "#a4e100"
                     }
             }*/
        },
        legend: {
            plot: {
                cssClass: 'myLegend',
                labelAttrs: {
                    fill: "#ffffff",
                    "font-size": 15,
                    "font-weight": "bold"
                },
                titleAttrs: {
                    fill: "#ffffff",
                    "font-size": 20,
                    "font-weight": "bold"
                },
                marginBottomTitle: 10,
                marginBottom: 10,
                marginLeft: 10,
                hideElemsOnClick: {
                    opacity: 0
                },
                title: " ",
                slices: [{
                    type: "image",
                    url: "/img/red_dot.gif",
                    height: 13,
                    width: 13,
                    sliceValue: 1,
                    attrs: {
                        fill: "#EA0707"
                    },
                    label: "SEVERITY 1"
                }, {
                    size: 10,
                    type: "circle",
                    sliceValue: 2,
                    attrs: {
                        fill: "#FFAA00"
                    },
                    label: "SEVERITY 2"
                },

                ]
            }
        },

        // Add some plots on the map
        plots: {

            //// Image plot
            //'Delhi': {
            //    value: 1,
            //    latitude: 28.86,
            //    longitude: 77.3444,
            //    tooltip: { content: "<span style=\"font-weight:bold;\">City :</span> Delhi" },

            //},
            //// Square plot
            //'rennes': {
            //    value: 2,
            //    latitude: 48.114166666667,
            //    longitude: -1.6808333333333,
            //    tooltip: { content: "Rennes" },
            //}
        }
    });




}






function arrayToObject(arr) {
    var ob = {};
    for (i = 0; i < arr.length; i++) {
        ob["plot" + i] = arr[i];
    }
    return ob;
}


// Render Incident Chart
function RenderIncidentChart(monthData) {

    var seriesData = [];

    var total = 0;
    for (i = 0; i < monthData.length; i++) {
        seriesData.push(parseInt(monthData[i].stats.count));
        total += parseInt(monthData[i].stats.count);
    }

    var avgData = total / seriesData.length;

    $(function () {

        $('#incidentmonthchart').highcharts({
            chart: {
                type: 'spline',
                backgroundColor: 'transparent',
                spacing: [10, 10, 5, 10],
                style: {
                    fontFamily: 'Helvetica',
                    fontSize: '16px'
                },
                events: {
                    load: function () {
                        var chart = this;
                        setTimeout(function () {
                            if (chart && chart.options) chart.reflow();
                        }, 0);
                    }
                }
            },
            title: {
                text: 'Incidents by Month',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                categories: generateMonthListForChart(monthData),
                labels: {
                    style: {
                        color: '#000',
                        fontSize: '12px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                labels: {
                    style: {
                        color: '#000',
                        fontSize: '12px'
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'rgb(0,172,238)'
                }],
                // Average Line
                plotLines: [{
                    color: '#e94d3e',
                    value: avgData,
                    width: '1',
                    zIndex: 2
                }]
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '<span style="font-size:16px">{point.y}</span>'
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            colors: [
                '#0c77be'
            ],
            series: [{
                showInLegend: false,
                name: 'Incidents',
                data: seriesData
            }]
        });

    });

    return parseInt(avgData);

}


// Method for Incidents by Month to refine Priority 1 and 2 data in seperate Array 

function refineMonthlyData(mainArray, priority1Array, priority2Array) {

    for (i = 0; i < mainArray.length; i++) {

        var priority = parseInt(mainArray[i].groupby_fields[0].value);
        if (priority == 1)
            priority1Array.push(mainArray[i]);
        else if (priority == 2)
            priority2Array.push(mainArray[i]);
    }
}



// Method for Incidents by Region to refine Priority 1 and 2 data in seperate Array

function refineRegionData(mainArray, priority1Array, priority2Array) {



    for (i = 0; i < mainArray.length; i++) {
        if (mainArray[i].groupby_fields[1].value != "") {
            var priority = parseInt(mainArray[i].groupby_fields[0].value);
            if (priority == 1)
                priority1Array.push(mainArray[i]);
            else if (priority == 2)
                priority2Array.push(mainArray[i]);
        }
    }
}


// 4 Region
var regionAlias = [{
    key: "APAC",
    value: "AP"
}, {
    key: "Europe",
    value: "EU"
}, {
    key: "Latin America",
    value: "LA"
}, {
    key: "North America",
    value: "NA"
}];

// Region Aliases
function GetRegionAlias(key) {

    for (i = 0; i < regionAlias.length; i++) {
        if (key === regionAlias[i].key)
            return regionAlias[i].value;
    }
    return key;

}

// Render Region Chart
function RenderRegionChart(regionData) {

    var regions = ['NA', 'LA', 'EU', 'AP'];

    var totalCount = 0;
    for (i = 0; i < regionData.length; i++) {
        totalCount += parseInt(regionData[i].stats.count);
    }
    //console.log(totalCount);

    var seriesData = [];
    for (i = 0; i < regionData.length; i++) {
        var item = [];
        // Region
        item.push(GetRegionAlias(regionData[i].groupby_fields[1].value));
        // Region Count
        item.push(regionData[i].stats.count);
        // Region Share %
        item.push(parseFloat(((parseInt(regionData[i].stats.count) / totalCount) * 100).toFixed(2)));
        seriesData.push(item);
    }

    //console.log(seriesData);

    var shareData = [];
    for (j = 0; j < regions.length; j++) {

        var key = regions[j];

        for (k = 0; k < seriesData.length; k++) {
            if (key == seriesData[k][0]) {
                shareData.push(seriesData[k]);
                break;
            } else if (k == seriesData.length - 1) {
                shareData.push([key, "0", 0]);
                break;
            }
        }
    }

    return shareData;
}


// Method for Incidents by group to refine Priority 1 and 2 data in seperate Array //Added By Rohtash

function refineGroupData(mainArray, priority1Array, priority2Array) {

    for (i = 0; i < mainArray.length; i++) {

        var priority = parseInt(mainArray[i].groupby_fields[1].value);
        if (priority == 1)
            priority1Array.push(mainArray[i]);
        else if (priority == 2)
            priority2Array.push(mainArray[i]);
    }
}


// 16 Tower
var towerAlias = [{
    key: "PM",
    value: "PM"
}, {
    key: "Web",
    value: "WEB"
}, {
    key: "SOC",
    value: "SOC"
}, {
    key: "GIO AAS",
    value: "BASIS"
}, {
    key: "GIO Core",
    value: "CORE"
}, {
    key: "Video Tower",
    value: "VIDEO"
}, {
    key: "Voice Tower",
    value: "VOICE"
}, {
    key: "Server Tower",
    value: "SERVER"
}, {
    key: "Customer BP",
    value: "CUSTOMER"
}, {
    key: "Logistics BP",
    value: "LOGISTICS"
}, {
    key: "Sourcing BP",
    value: "SOURCING"
}, {
    key: "GIO Database",
    value: "DATABASE"
}, {
    key: "Network Tower",
    value: "NETWORK"
}, {
    key: "Desktop Tower",
    value: "DESKTOP"
}, {
    key: "Access control",
    value: "CONTROL"
}, {
    key: "Security Tower",
    value: "SECURITY"
}, {
    key: "Accounts Payable",
    value: "PAYABLE"
}, {
    key: "Supporting teams",
    value: "SUPPORT"
}, {
    key: "Incident Management",
    value: "MANAGEMENT"
}, {
    key: "Service Desk Tower",
    value: "SERVICE DESK"
}];

// Tower Aliases
function GetTowerAlias(key) {

    for (i = 0; i < towerAlias.length; i++) {
        if (key === towerAlias[i].key)
            return towerAlias[i].value;
    }
    return key;

}

// Render Tower Chart
function IncidentTowerChart(towerData) {

    var seriesData = [];

    for (t = 0; t < towerData.length; t++) {
        var item = {};
        item["name"] = towerData[t].groupby_fields[0].value; //GetTowerAlias(towerData[t].groupby_fields[0].value);
        item["y"] = parseInt(towerData[t].stats.count);
        seriesData.push(item);
    }
    //console.log(seriesData);

    $(function () {

        // Create the chart
        $('#incidenttowerchart').highcharts({
            chart: {
                type: 'column',
                backgroundColor: 'transparent',
                spacing: [10, 10, 5, 10],
                style: {
                    fontFamily: 'Helvetica',
                    fontSize: '16px'
                },
                events: {
                    load: function () {
                        var chart = this;
                        setTimeout(function () {
                            if (chart && chart.options) chart.reflow();
                        }, 0);
                    }
                }
            },
            title: {
                text: 'Incidents to Application',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                type: 'category',
                labels: {
                    style: {
                        color: '#000',
                        fontSize: '12px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'incidents share'
                },
                labels: {
                    style: {
                        color: '#000',
                        fontSize: '12px'
                    }
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '<span style="font-size:16px">{point.y}</span>'
                    }
                }
            },
            colors: ['#ffaa00', '#0c77be', '#f2682d', '#16ac9f', '#e94d3e'],
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
            },

            series: [{
                name: 'Incident Share',
                colorByPoint: true,
                data: seriesData
            }]
        });
    });


}

// ----------------------------- Functions ---------------------------------------------- //

// Get Current Year
function CurrentYear() {
    var currY = (new Date()).getUTCFullYear();
    return currY;
}

// Months
var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Get Current Month
function CurrentMonth() {

    var currM = (new Date()).getUTCMonth();
    return (monthsArr[currM]);
}

//Sort by Type of Location 

function sortByName(arr) {

    arr.sort(function (a, b) {
        var nameA = a.type.toLowerCase(),
            nameB = b.type.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    })
}

// Sorting by Month - Year (For Incidents By Month) // Rohtash

function sortingComparing(a, b) {

    var first = {};
    var second = {};

    first.arr = a.groupby_fields[1].value.split("-");
    second.arr = b.groupby_fields[1].value.split("-");

    first.month = parseInt(first.arr[0]);
    second.month = parseInt(second.arr[0]);

    first.year = parseInt(first.arr[1]);
    second.year = parseInt(second.arr[1]);

    if (first.year > second.year || first.year < second.year)
        return first.year - second.year;

    if (first.year == second.year) {
        if (first.month > second.month || first.month < second.month)
            return first.month - second.month;
    }
}

// Sorting by Month No (For Incidents By Month)  Rohtash

function sortingComparingOnMonthNo(a, b) {

    var month1 = parseInt(a.groupby_fields[1].value);
    var month2 = parseInt(b.groupby_fields[1].value);
    return month1 - month2;
}

function reArrangementOfMonthlyData(monthData) {

    var data = monthData;
    var currentMonth = (new Date()).getUTCMonth() + 1;
    var nextYearMonths = data.slice(0, currentMonth);
    data.splice(0, currentMonth);
    var finalData = data.concat(nextYearMonths);
    return finalData;
}

// Generating Month List for Chart

function generateMonthListForChart(monthData) {
    var monthList = [];
    var temp = "";
    var stringWithMonthName = "";
    var currentMonth = (new Date()).getUTCMonth() + 1;
    var currentYear = (new Date()).getUTCFullYear();
    for (i = 0; i < monthData.length; i++) {

        month = monthData[i].groupby_fields[1].value;
        var year = (currentMonth >= month) ? currentYear : currentYear - 1;
        stringWithMonthName = monthsArr[month - 1].substring(0, 3).toUpperCase() + "-" + year;

        monthList.push(stringWithMonthName);
    }
    return monthList;
}

function generateMonthListForChart2(monthData) {
    var monthList = [];
    var splitArray = [];
    var month;
    var year;
    for (i = 0; i < monthData.length; i++) {
        splitArray = monthData[i].groupby_fields[1].value.split('-');
        month = splitArray[0];
        year = splitArray[1];

        stringWithMonthName = monthsArr[splitArray[0] - 1].substring(0, 3).toUpperCase + "-" + splitArray[1];

        monthList.push(stringWithMonthName);
    }
    return monthList;
}

// Merging Duplicate Fields in Monthly Data

//function mergeDuplicateMonthlyData(monthData) {

//    var newMonthData = [];

//    var tempData = {};

//    for(i=0;i<month)





//}


// For Searching Element Form Array

function getDetails(arrayData, incidentno) {

    var detail = {};
    for (i = 0; i < arrayData.length; i++) {

        if (arrayData[i].number == incidentno) {
            detail = arrayData[i];
            break;
        }
    }
    return detail;
};

