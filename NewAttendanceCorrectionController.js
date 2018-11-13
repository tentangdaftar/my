angular
    .module('altairApp')
    .controller('digiNewAttendaceCorrectionCtrl',
        function ($scope, $rootScope, utils, $cookies, $log, $location, CommonService, uiCalendarConfig,
                  ReconstructMenu, $filter, $window, $timeout, NotificationService, $element, $compile, GlobalTypeFactory, AttendanceModuleFactory, BPIConfiguration, AssignmentModuleFactory) {

            ReconstructMenu.Init();
            $scope.showCalendar = true;
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.dataemployee = {};
            $scope.listServeGroup = {options: []};//inisialisasi dropdown
            $scope.listType = {options: []};//inisialisasi dropdown
            $scope.listSellingStep = {options: []};//inisialisasi dropdown
            $scope.listReasonGroup = {options: []};//inisialisasi dropdown
            $scope.listActivityGroup = {options: []};//inisialisasi dropdown
            $scope.listResultGroup = {options: []};//inisialisasi dropdown
            $scope.listProject = {options: []};//inisialisasi dropdown
            $scope.attendanceCycleDate = {};
            $scope.flag = "netral";
            $scope.calendarView = true;
            $scope.showDefaultPanel = false;
            $scope.showPanelForBCSales = false;
            $scope.detailtime = false;
            $scope.nonbc = false;
            $scope.bc = false;
            $scope.request = {
                servegroup: ''
            }
            $scope.listActivity = [];
            $scope.listAssignment = [];
            $scope.startdate = false;


            $scope.insertEntity = {
                name: "",
                npk: "",
                userid: "",
                directhead: "",
                directheadName: "",
                koreksireasonId: "",
                koreksireasonName: "",
                koreksireasonRemark: "",
                startTime: "",
                endTime: "",
                startTimeString: "",
                endTimeString: "",
                result: "",
                description: "",
                achievement: "",
                servegroup: "",
                servegroupID: "",
                servegroupname: "",
                assignmentid: "",
                assignmentName: "",
                activityID: "",
                activityname: "",
                resultID: "",
                resultname: "",
                typeid: "",
                typename: "",
                sellingstepid: "",
                sellingstepname: "",
                nextActivityDate: "",
                nextactivitydateString: "",
                nextactivitydescription: "",
                status: ""
            };

            init();
            $scope.mode = 'month';


            function init() {
                getActivity();
                getSellingStep();
                getActivity();
                getServeGroup();
                getResult();
                getProject();
                getAttendanceCycle();
                loadGlobalType();
                $scope.tgl = new Date();
                $scope.actionkoreksi = true;
                $scope.projecthide = true;
                var adit = localStorage.getItem('data_user_employee');
                $scope.dataemployee = JSON.parse(adit);
                $scope.insertEntity.npk = $scope.dataemployee.employeeTemplate.npk;
                $scope.insertEntity.directhead = $scope.dataemployee.employeeTemplate.directHead;
                $scope.insertEntity.directheadName = $scope.dataemployee.employeeTemplate.directHeadName;
                $scope.insertEntity.userid = $scope.dataemployee.employeeTemplate.employeeId;
                $scope.insertEntity.name = $scope.dataemployee.employeeTemplate.employeeName;
                $scope.namadep = $scope.dataemployee.employeeTemplate.departmentName;
            };

            function getAttendanceCycle() {

                var success = function (data) {
                    $scope.attendanceCycleDate = data.result;

                };

                var error = function () {

                };

                GlobalTypeFactory.getAttendanceCycleDate().then(success, error);
            };

            function getActivity() {//isi dropdown activity
                var success = function (data) {
                    var list = new Array();
                    var list2 = new Array();

                    $scope.listActivity = data.result;
                    $scope.listActivityGroup.options = list;

                    var activitytype = $filter('filter')($scope.listActivity, {servegroupid: "ACTIVITY_TYPE_SALESSTREAM"});

                    for (var a = 0; a < activitytype.length; a++) {
                        var ga = activitytype[a];
                        var object = {
                            id: ga.id,
                            title: ga.name,
                            value: ga.id,
                            parent_id: "-"
                        };
                        list2.push(object);
                    }
                    $scope.listType.options = list2;
                }

                var error = function (data) {
                    //////console.log('Error');
                };
                BPIConfiguration.getAllActivityCategory().then(success, error);
            };

            function getSellingStep() {
                var success = function (data) {
                    var list = new Array();
                    var list2 = new Array();

                    $scope.listActivity = data.result;
                    $scope.listSellingStep.options = list;

                    var sellingtypes = $filter('filter')($scope.listActivity, {servegroupid: "SELLING_STEP_ID"});

                    for (var a = 0; a < sellingtypes.length; a++) {
                        var ga = sellingtypes[a];
                        var object = {
                            id: ga.id,
                            title: ga.name,
                            value: ga.id,
                            parent_id: "-"
                        };
                        list2.push(object);
                    }
                    $scope.listSellingStep.options = list2;
                }

                var error = function (data) {
                    //////console.log('Error');
                };
                BPIConfiguration.getAllActivityCategory().then(success, error);
            };

            function getServeGroup() {
                var success = function (data) {

                    var list = new Array();

                    for (var a = 0; a < data.result.length; a++) {
                        var ga = data.result[a];
                        var object = {
                            id: ga.id,
                            title: ga.name,
                            value: ga.id,
                            parent_id: "-"
                        };
                        list.push(object);
                    }
                    $scope.listServeGroup.options = list;
                };

                var error = function (data) {
                    //////console.log('Error');
                };

                BPIConfiguration.getAllServeGroup().then(success, error);
            }

            function getResult() {
                var success = function (data) {
                    var list = new Array();
                    // var none = {
                    //     id: "",
                    //     title: "None",
                    //     value: "None",
                    //     parent_id: ""
                    // };
                    //
                    // list.push(none);
                    for (var a = 0; a < data.result.length; a++) {
                        var ga = data.result[a];
                        var object = {
                            id: ga.id,
                            title: ga.name,
                            value: ga.id,
                            parent_id: "-"
                        };
                        list.push(object);
                    }
                    $scope.listResultGroup.options = list;
                }

                var error = function (data) {
                    //////console.log('Error');
                };

                BPIConfiguration.getAllResult().then(success, error);
            }

            function getProject() { //listproject
                var adit = localStorage.getItem('data_user_employee');
                var dataemployee = JSON.parse(adit);
                //////console.log(adit);
                var npk = dataemployee.employeeTemplate.npk;

                var success = function (data) {

                    $scope.listAssignment = data.result;
                    var list = new Array();
                    // var none = {
                    //     id: "",
                    //     title: "None",
                    //     value: "None",
                    //     parent_id: ""
                    // };
                    //
                    // list.push(none);
                    /*for (var a = 0; a < data.result.length; a++) {
                        var ga = data.result[a];
                        var object = {
                            id: ga.id,
                            title: ga.assignmentNumber+' ('+ga.name+')',
                            value: ga.id,
                            parent_id: "-"
                        };
                        list.push(object);
                    }*/
                    $scope.listProject.options = list;
                }

                var error = function (data) {
                    //////console.log('Error');
                };

                var isi = {
                    employeeId: npk,
                    status: "3001",
                    row: 100,
                    page: 0,
                    sortName: "id",
                    sortBy: "asc"
                }
                AssignmentModuleFactory.getnameproject(isi).then(success, error);
            }

            $scope.getPM = function () {
                if ($scope.insertEntity.servegroupID != null && $scope.insertEntity.servegroupID != '') {
                    if ($scope.insertEntity.servegroupID == 'PRJI' || $scope.insertEntity.servegroupID == 'PRJO') {
                        var wbs = $scope.insertEntity.assignmentid;
                        var wbslength = wbs.length;

                        if (wbslength == 15) {
                            var projectnumber = wbs.substring(0, 8);//substring project number

                        }
                        else {
                            var projectnumber = wbs.substring(0, 9);//substring project number

                        }

                        var success = function (data) {
                            if (data.result.length > 0) {

                                var npkPM = data.result[0].pmNPK;
                                if ($scope.insertEntity.npk == npkPM) {
                                    $scope.insertEntity.directheadName = $scope.dataemployee.employeeTemplate.directHeadName;
                                    $scope.insertEntity.directhead = $scope.dataemployee.employeeTemplate.directHead;
                                }
                                else {
                                    $scope.namadirect = data.result[0].pmName;
                                    $scope.npkdirect = data.result[0].pmNPK;
                                    $scope.insertEntity.directheadName = data.result[0].pmName;
                                    //console.log("PMMMM" + JSON.stringify($scope.insertEntity.directHeadName ) );
                                    $scope.insertEntity.directhead = data.result[0].pmNPK;
                                }


                            }
                            else {
                                $scope.namadirect = "";
                                $scope.npkdirect = "";
                                $scope.insertEntity.directHeadName = "";
                                $scope.insertEntity.directHead = "";
                            }
                        };

                        var error = function (data) {
                            //$log.info('error');
                        };

                        var obj = {
                            projectNo: projectnumber
                        };

                        AssignmentModuleFactory.getProjectManager(obj).then(success, error);
                    }
                }
            };

            function loadGlobalType() {
                var param = {
                    name: "",
                    category: "",
                    modulId: "8",
                    typeId: "",
                    parent: ""
                };

                var success = function (data) {
                    var list = [];
                    for (var a = 0; a < data.globalType.length; a++) {
                        var ga = data.globalType[a];
                        var object = {
                            id: ga.typeId,
                            title: ga.name,
                            value: ga.typeId,
                            parent_id: "-"
                        };
                        list.push(object);
                    }
                    $scope.listReasonGroup.options = list;
                }

                var error_login = function (data) {
                    //$log.info('LOGIN_ERROR');
                };

                GlobalTypeFactory.searchGlobalTypeByParameter(param).then(success, error_login);
            };

            $scope.selectize_a_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Item',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title'
            };

            $('#calendar').on('click', '.fc-agendaDay-button', function () {
                $scope.mode = 'agendaDay';
            });

            $('#calendar').on('click', '.fc-month-button', function () {
                $scope.mode = 'month';
            });

            $scope.uiConfig = {
                calendar: {
                    header: {
                        left: 'title today',
                        center: '',
                        right: 'month,agendaDay prev,next'
                    },
                    defaultView: 'month',
                    buttonIcons: {
                        prev: 'md-left-single-arrow',
                        next: 'md-right-single-arrow',
                        prevYear: 'md-left-double-arrow',
                        nextYear: 'md-right-double-arrow'
                    },
                    buttonText: {
                        today: ' ',
                        month: ' ',
                        week: ' ',
                        day: ' '
                    },
                    aspectRatio: 2.1,
                    defaultDate: moment(),
                    selectable: true,
                    selectHelper: true,
                    navLinks: true,
                    // next: function () {
                    //     alert('test');
                    // },
                    dayClick: function (date, allDay, jsEvent, view) {
                        $scope.flagCoba = false;
                        var tampungData = [];
                        var now = date.format("DD-MM-YYYY");

                        for (var i = 0; i < $scope.tampungDataAll.length; i++) {
                            var coba = $filter('date')(new Date($scope.tampungDataAll[i].kdserveonmoment), 'dd-MM-yyyy');
                            if (coba == now) { //jika ada data ditanggal yg diklik
                                tampungData.push($scope.tampungDataAll[i]);
                                $scope.tampungAllFix = tampungData;
                                //console.log("ozil" + JSON.stringify($scope.tampungAllFix))
                                if ($scope.tampungAllFix != "" || $scope.tampungAllFix != null) {
                                    $scope.flagCoba = true;
                                }
                                else {//tidak ada data ditgl tsb
                                    $scope.flagCoba = false;
                                }
                            }

                        }
                        //console.log("ozil" + JSON.stringify($scope.tampungAllFix))
                        var tglklik = date.format("YYYYMMDD");

                        var tgl = new Date();
                        var tglskg = tgl.getDate();
                        var blnskg = (tgl.getMonth() + 1);
                        var thnskg = tgl.getFullYear();
                        var gabung = thnskg + '' + blnskg + tglskg;

                        if (tglklik > gabung) {
                            NotificationService.setWarningMessage("Cannot create service correction in this date");
                        }
                        else {
                            if ($scope.mode == 'month') {
                                $('#calendar').fullCalendar('changeView', "agendaDay")
                                $('#calendar').fullCalendar('gotoDate', date);
                                $scope.mode = 'agendaDay';
                            }
                        }

                    },
                    showNonCurrentDates: false,
                    select: function (start, end) {
                        $scope.flag = "netral";

                        var startDate = new Date(start.format("DD MMM YYYY  HH:ss"));
                        var endDate = new Date(end.format("DD MMM YYYY  HH:ss"));
                        var maximumEntryDate = addDays(new Date(start.format("DD MMM YYYY  HH:ss")), 60);
                        $scope.startTime = new Date(start.format("DD MMM YYYY  HH:mm"));
                        $scope.endTime = new Date(end.format("DD MMM YYYY  HH:mm"));
                        var confirm = function () {

                            var startCycle = new Date($scope.attendanceCycleDate.from);
                            var endCycle = new Date($scope.attendanceCycleDate.to);
                            endCycle.setHours(23);
                            endCycle.setMinutes(59);
                            endCycle.setSeconds(59);

                            ////console.log("START CYCLE DATE: " + startCycle.getTime());
                            ////console.log("END CYCLE DATE: " + endCycle.getTime());
                            ////console.log("START DATE: " + endCycle.getHours() + endCycle.getMinutes());
                            var tgl = new Date();
                            var awalDrag = startDate.getTime();
                            var akhirDrag = endDate.getTime();
                            var awalstring = moment(new Date(awalDrag)).format("HH:mm");
                            var akhirstring = moment(new Date(akhirDrag)).format("HH:mm");
                            $scope.flagTimesheet = false;

                            if ($scope.flagCoba == true) {// jika ada data dihari itu
                                for (var a = 0; a < $scope.tampungAllFix.length; a++) {
                                    var momentServeOn = $scope.tampungAllFix[a].kdserveonmoment;
                                    var momentServeOff = $scope.tampungAllFix[a].kdserveoffmoment;
                                    var ServeOnstring = moment(new Date(momentServeOn)).format("HH:mm");
                                    //alert(ServeOnstring)
                                    var ServeOffstring = moment(new Date(momentServeOff)).format("HH:mm");
                                    // console.log("dragawal" + awalstring)
                                    // console.log("dragakhir" + akhirstring)
                                    // console.log("serveon" + ServeOnstring)
                                    // console.log("serveoff" + ServeOffstring)
                                    if (awalstring >= ServeOnstring && akhirstring >= ServeOnstring) {
                                        //alert("1")
                                        // $scope.flagTimesheet = false;
                                        if (awalstring >= ServeOnstring && akhirstring < ServeOffstring) {
                                            //alert("1.2")
                                            $scope.flagTimesheet = true;
                                            break;
                                        }
                                        if (awalstring < ServeOffstring && akhirstring >= ServeOffstring) {
                                            //alert("1.3")
                                            $scope.flagTimesheet = true;
                                            break;
                                        }

                                    }
                                    else if (awalstring <= ServeOnstring && akhirstring <= ServeOnstring) {
                                        //alert("2")
                                        $scope.flagTimesheet = false;

                                        // if(awalstring <= ServeOnstring && akhirstring >= ServeOffstring){
                                        //     //alert("2.2")
                                        //     $scope.flagTimesheet = true;
                                        //     break;
                                        // }
                                    }
                                    else {
                                        $scope.flagTimesheet = true;
                                        break;
                                    }

                                }
                                if ($scope.flagTimesheet == true) { //jika tdk didalam irisan tdk bisa
                                    NotificationService.setWarningMessage("Cannot create service correction in the same time");
                                }
                                else {
                                    $scope.startdate = true;
                                    $scope.endate = true;
                                    $scope.starttimebcdis = true;
                                    $scope.endtimebcdis = true;
                                    $scope.calendarView = false;
                                    $scope.showDefaultPanel = true;
                                    $scope.showPanelForBCSales = false;
                                    $scope.showCalendar = false;
                                    $scope.insertEntity.startTime = start;
                                    $scope.insertEntity.endTime = end;
                                    $scope.insertEntity.startTimeString = start.format("DD-MM-YYYY HH:mm");
                                    $scope.insertEntity.endTimeString = end.format("DD-MM-YYYY HH:mm");
                                    $scope.actionkoreksi = true;
                                }
                            }
                            else { //tidak ada data di hari itu, koreksi biasa
                               

                                    ////console.log("\n" + startDate.toLocaleDateString() + "\n" + endCycle.toLocaleDateString());
                                   
                                       
                                                $scope.startdate = true;
                                                $scope.endate = true;
                                                $scope.starttimebcdis = true;
                                                $scope.endtimebcdis = true;
                                                $scope.calendarView = false;
                                                $scope.showDefaultPanel = true;
                                                $scope.showPanelForBCSales = false;
                                                $scope.showCalendar = false;
                                                // $scope.nonbc = true;
                                                $scope.insertEntity.startTime = start;
                                                $scope.insertEntity.endTime = end;
                                                $scope.insertEntity.startTimeString = start.format("DD-MM-YYYY HH:mm");
                                                // alert($scope.insertEntity.startTimeString);
                                                $scope.insertEntity.endTimeString = end.format("DD-MM-YYYY HH:mm");
                                                $scope.actionkoreksi = true;
                                            
                                       
                                    
                                
                            }

                            /*
                            $scope.tanggal = start.format("YYYYMMDD");//tanggal klik attendance
                            var tglskg = tgl.getDate();//get tanggal
                            var blnskg = (tgl.getMonth() + 1);//get month
                            var thnskg = tgl.getFullYear();//get tahun
                            var gabung = thnskg + '' + blnskg + tglskg;//gabung tglbulantahun
                            $scope.waktuterakhir = end.format("HH:ss");//ambil jam dari serve off calendar
                            var jamskg = tgl.getHours() + ':' + tgl.getMinutes();//ambil jam sekarang


                            if ($scope.tanggal == gabung) {
                                if (jamskg < $scope.waktuterakhir) {
                                    NotificationService.setWarningMessage("Cannot create service correction in this hour");
                                }
                                else {
                                    var role = $scope.dataemployee.employeeTemplate.customfield2;

                                    $scope.calendarView = false;
                                    $scope.showDefaultPanel = true;
                                    $scope.showPanelForBCSales = false;
                                    $scope.showCalendar = false;
                                    // $scope.nonbc = true;
                                    $scope.insertEntity.startTime = start;
                                    $scope.insertEntity.endTime = end;
                                    $scope.insertEntity.startTimeString = start.format("DD-MM-YYYY HH:mm");
                                    $scope.insertEntity.endTimeString = end.format("DD-MM-YYYY HH:mm");
                                }
                            }
                            else {
                                var role = $scope.dataemployee.employeeTemplate.customfield2;

                                $scope.calendarView = false;
                                $scope.showDefaultPanel = true;
                                $scope.showPanelForBCSales = false;
                                $scope.showCalendar = false;
                                // $scope.nonbc = true;
                                $scope.insertEntity.startTime = start;
                                $scope.insertEntity.endTime = end;
                                $scope.insertEntity.startTimeString = start.format("DD-MM-YYYY HH:mm");
                                $scope.insertEntity.endTimeString = end.format("DD-MM-YYYY HH:mm");
                            }*/

                        };

                        if ($scope.mode == 'agendaDay') {
                            UIkit.modal.confirm("Do you want to create Service Correction ?", confirm)
                        }
                    },
                    editable: true,
                    eventClick: function (calEvent, jsEvent, view) { //event click detail
                        if (calEvent.url) {
                            return false;
                        }
                        $scope.serveonlong = calEvent.kdserveonmoment;//waktu dalam long
                        $scope.serveofflong = calEvent.kdserveoffmoment;
                        $scope.serveon = calEvent.kdserveon;
                        $scope.status = calEvent.status;
                        var startCycle = new Date($scope.attendanceCycleDate.from);
                        var endCycle = new Date($scope.attendanceCycleDate.to);
                        var maximumEntryDate = moment($scope.serveonlong).add(60, 'days')

                        var tgl = new Date();
                        endCycle.setHours(23);
                        endCycle.setMinutes(59);
                        endCycle.setSeconds(59);

                        if ($scope.status == '1001') {
                            if ($scope.serveonlong >= startCycle.getTime()) {
                                if ($scope.serveonlong <= endCycle.getTime()) {
                                    if ($scope.serveonlong <= tgl.getTime()) {
                                        if (tgl.getTime() <= maximumEntryDate) {
                                            $scope.actionkoreksi = true;
                                        }
                                        else {
                                            $scope.actionkoreksi = false;
                                        }
                                    }
                                    else {
                                        $scope.actionkoreksi = false;
                                    }
                                }
                                else {
                                    $scope.actionkoreksi = false;
                                }
                            }
                            else {
                                $scope.actionkoreksi = false;
                            }
                        }
                        else {
                            $scope.actionkoreksi = false;
                        }


                        $scope.detailtime = true; //divdetail show
                        $scope.mode = 'agendaDay';


                        $scope.serveoff = calEvent.kdserveoff;
                        $scope.servegroup = calEvent.kdservegroup;
                        $scope.activity = calEvent.kdactivity;
                        $scope.description1 = calEvent.kddescription1;
                        $scope.kodeserve = calEvent.kdkodeserve;
                        $scope.servegroupid = calEvent.kdservegroupid;
                        $scope.namaachievement = calEvent.kdnamaachievement;
                        $scope.hasil = calEvent.kdhasil;
                        $scope.hasilname = calEvent.kdhasilname;
                        $scope.sellingstep = calEvent.kdsellingstep;
                        $scope.namatipe = calEvent.kdnamatipe;
                        $scope.datenext = calEvent.kddatenext;
                        $scope.desnext = calEvent.kddesnext;
                        $scope.idserve = calEvent.id;
                        $scope.kodereason = calEvent.kdreason;
                        $scope.namareason = calEvent.reasonname;
                        $scope.project = calEvent.kdassignment;
                        $scope.isiachieve = calEvent.achive;
                        $scope.kodeserve = calEvent.kdserve;
                        $scope.kodeflag = calEvent.kodecase;
                        $scope.projectnama = calEvent.namaassignment;
                        $scope.projectkode = calEvent.kdassignment;
                        $scope.tipe = calEvent.tipeserve;
                        $scope.status = calEvent.status;
                        // $scope.progressval = calEvent.progval;


                        if (calEvent.kdserve == 'SL') {
                            $scope.nonbc = true;
                            $scope.calendarView = false;
                            $scope.bc = true;
                        } else {
                            $scope.nonbc = true;
                            $scope.calendarView = false;
                            $scope.bc = false;
                        }

                    },
                    googleCalendarApiKey: 'AIzaSyBIE73sd-u57R8TVTaCTWzrDNeQKbeepy8',//key API google developers
                    eventSources: [
                        {
                            googleCalendarId: 'en.indonesian#holiday@group.v.calendar.google.com',
                            color: 'red'
                        },
                        {

                            events: function (start, end, timezone, callback) {
                                var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait ... <br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');

                                var success = function (data) {
                                    //////console.log("data ini" + JSON.stringify(data.result));
                                    var data_timeline = [];
                                    for (var i = 0; i < data.result.length; i++) {
                                        var display = data.result[i];
                                        //console.log("isi" + JSON.stringify(data.result));
                                        var time1 = $filter('date')(new Date(display.serveOnTime), 'yyyy-MM-dd HH:mm');
                                        var time2 = $filter('date')(new Date(display.serveOffTime), 'yyyy-MM-dd HH:mm');
                                        ////console.log("tes" + JSON.stringify(data.result))

                                        var tipene = display.type;
                                        var warna = "";
                                        var flagserveoff = "";
                                        if (display.codecase == "Y") {
                                            flagserveoff = "Auto Serve Off";
                                        }
                                        else {
                                            flagserveoff = "";
                                        }
                                        if (tipene == 40) {
                                            warna = '#3498DB';
                                        }
                                        else if (tipene == 20) {
                                            warna = '#1ABC9C';
                                        }
                                        else if (tipene == 10) {
                                            warna = '#3498DB';
                                        }


                                        if(display.timeSheets.description != null || display.timeSheets.description != "" ){
                                            var title = display.timeSheets.serve_group_name + "\n" + display.timeSheets.activity_name + "\n" + display.timeSheets.description + "\n" + flagserveoff;
                                        }
                                        else{
                                            var title = display.timeSheets.serve_group_name + "\n" + display.timeSheets.activity_name + "\n"  + flagserveoff;
                                        }
                                        var tes = {
                                            id: display.id,
                                            title: title,
                                            kdserve: display.timeSheets.serve_group_id,
                                            kdserveon: display.serveOnTimeString,
                                            kdserveonmoment: display.serveOnTimeLong,
                                            kdserveoffmoment: display.serveOffTimeLong,
                                            kdserveoff: display.serveOffTimeString,
                                            kdservegroup: display.timeSheets.serve_group_name,
                                            kdactivity: display.timeSheets.activity_name,
                                            kddescription1: display.timeSheets.description,
                                            kdkodeserve: display.servedId,
                                            kodecase: display.codecase,
                                            kdservegroupid: display.timeSheets.serve_group_id,
                                            kdnamaachievement: display.timeSheets.achievement,
                                            kdhasil: display.timeSheets.result_id,
                                            kdhasilname: display.timeSheets.result_name,
                                            kdsellingstep: display.timeSheets.selling_step_name,
                                            kdnamatipe: display.timeSheets.type_name,
                                            kddatenext: display.timeSheets.next_activity_date,
                                            kddesnext: display.timeSheets.next_activity_description,
                                            kdreason: display.corrections.reason_id,
                                            reasonname: display.corrections.reasonName,
                                            kdassignment: display.timeSheets.assignment_id,
                                            namaassignment: display.timeSheets.assignmentName,
                                            achive: display.timeSheets.achievement,
                                            // progval : display.timeSheets.progress_value,
                                            tipeserve: display.type,
                                            status: display.status,
                                            start: time1,
                                            end: time2,
                                            backgroundColor: warna,
                                            editable: false
                                        };

                                        data_timeline.push(tes)
                                    }
                                    //console.log("data_timeline: " + JSON.stringify(data_timeline));
                                    $scope.tampungDataAll = data_timeline;
                                    callback(data_timeline);
                                    modal.hide();
                                };

                                var error = function () {
                                    $log.error("Failed");
                                    modal.hide();
                                };


                                var adit = localStorage.getItem('data_user_employee');
                                var dataemployee = JSON.parse(adit);
                                //////console.log(adit);
                                var npk = dataemployee.employeeTemplate.npk;


                                var date = $("#calendar").fullCalendar('getDate');
                                var cellMonth = date.month() + 1;
                                var cellyear = date.year();
                                var months = '';
                                if (cellMonth <= 9) {
                                    months = '0' + cellMonth;
                                } else {
                                    months = cellMonth;
                                }
                                var oke = {
                                    npk: npk,
                                    month: months,
                                    year: cellyear
                                };

                                AttendanceModuleFactory.displayattendance(oke).then(success, error);

                            }
                        }
                    ],


                    eventLimit: true,
                    color: '#000',
                    timeFormat: '(HH)(:mm)',
                }
            }


            $scope.simpanKoreksiAbsenbc = function () {
                var insert = false;
                var edit = false;
                var startbc = Date.parse($scope.startTime);
                var endbc = new Date($scope.endTime)
                var xx = moment(new Date(endbc)).format("DD-MM-YYYY HH:mm");


                if (endbc < startbc) {
                    NotificationService.setWarningMessage("Serve off more than Serve On");
                }
                else {

                    if ($scope.flag == "edit") {
                        if ($scope.insertEntity.koreksireasonId != undefined && $scope.insertEntity.koreksireasonId != '' && $scope.insertEntity.koreksireasonId != null) {
                            var correction = $filter('filter')($scope.listReasonGroup.options, {id: $scope.insertEntity.koreksireasonId});
                            if (correction.length > 0) {
                                var sg = correction[0];
                                $scope.insertEntity.koreksireasonName = sg.title;
                            }
                            if ($scope.endTime != undefined && $scope.endTime != '' && $scope.endTime != null) {

                                if ($scope.insertEntity.resultID != undefined && $scope.insertEntity.resultID != '' && $scope.insertEntity.resultID != null) {
                                    var result = $filter('filter')($scope.listResultGroup.options, {id: $scope.insertEntity.resultID});
                                    if (result.length > 0) {
                                        var sg = result[0];
                                        $scope.insertEntity.resultname = sg.title;
                                    }
                                    if ($scope.insertEntity.description != undefined && $scope.insertEntity.description != '' && $scope.insertEntity.description != null) {
                                        if ($scope.insertEntity.achievement != undefined && $scope.insertEntity.achievement != '' && $scope.insertEntity.achievement != null) {
                                            if ($scope.insertEntity.nextactivitydescription != undefined && $scope.insertEntity.nextactivitydescription != '' && $scope.insertEntity.nextactivitydescription != null) {
                                                edit = true;
                                            }
                                            else {
                                                NotificationService.setWarningMessage("Next Description is required");
                                            }
                                        }
                                        else {
                                            NotificationService.setWarningMessage("Achievement is required");
                                        }
                                    }
                                    else {
                                        NotificationService.setWarningMessage("Description is required");
                                    }
                                }
                                else {
                                    NotificationService.setWarningMessage("Activity is required");
                                }

                            }
                            else {
                                NotificationService.setWarningMessage("End Date is required");
                            }
                        }
                        else {
                            NotificationService.setWarningMessage("Correction Reason is required");
                        }
                        if (edit == true) {
                            var tes = moment(new Date($scope.insertEntity.nextactivitydateString)).format("DD-MM-YYYY");
                            $scope.insertEntity.nextactivitydateString = tes;
                            var result = $filter('filter')($scope.listResultGroup.options, {id: $scope.insertEntity.resultID});
                            if (result.length > 0) {
                                var sg = result[0];
                                $scope.insertEntity.resultname = sg.title;
                            }
                            var editEntity = {
                                serveId: $scope.idserve,
                                koreksireasonId: $scope.insertEntity.koreksireasonId,
                                koreksireasonName: $scope.insertEntity.koreksireasonName,
                                endTime: endbc,
                                endTimeString: xx,
                                resultID: $scope.insertEntity.resultID,
                                resultname: $scope.insertEntity.resultname,
                                description: $scope.insertEntity.description,
                                achievement: $scope.insertEntity.achievement,
                                nextactivitydateString: $scope.insertEntity.nextactivitydateString,
                                nextactivitydescription: $scope.insertEntity.nextactivitydescription,

                            }

                            var confirm = function () {
                                var success_insert = function (data) {
                                    if (data.status == true) {

                                        NotificationService.setSuccessMessage("Edit Data Success!");
                                        $timeout(function () {
                                            $window.location.reload();
                                        }, 1000);
                                    }
                                    else {
                                        NotificationService.setWarningMessage("error");
                                    }

                                };
                                var error_insert = function (data) {
                                    ////console.log('insert error');
                                };
                                ////console.log("jeri" + JSON.stringify(editEntity));
                                AttendanceModuleFactory.editAttendance(editEntity).then(success_insert, error_insert);
                            }
                            UIkit.modal.confirm("Do you want to edit this data ?", confirm);
                        }

                    }//masuk insert
                    else {

                        if ($scope.insertEntity.koreksireasonId != undefined && $scope.insertEntity.koreksireasonId != '' && $scope.insertEntity.koreksireasonId != null) {
                            // ////console.log("masuk");
                            var correction = $filter('filter')($scope.listReasonGroup.options, {id: $scope.insertEntity.koreksireasonId});
                            if (correction.length > 0) {
                                var sg = correction[0];
                                // ////console.log("Json stringify" + JSON.stringify(sg));
                                $scope.insertEntity.koreksireasonName = sg.title;
                            }

                            if ($scope.insertEntity.servegroupID != undefined && $scope.insertEntity.servegroupID != '' && $scope.insertEntity.servegroupID != null) {
                                var servegroup = $filter('filter')($scope.listServeGroup.options, {id: $scope.insertEntity.servegroupID});
                                if (servegroup.length > 0) {
                                    var sg = servegroup[0];
                                    $scope.insertEntity.servegroupname = sg.title;
                                }
                                var next = false;
                                if ($scope.insertEntity.servegroupID == 'INT') {
                                    next = true
                                } else {
                                    if ($scope.insertEntity.assignmentid != undefined && $scope.insertEntity.assignmentid != '' && $scope.insertEntity.assignmentid != null) {
                                        next = true;
                                        var assignment = $filter('filter')($scope.listProject.options, {id: $scope.insertEntity.assignmentid});
                                        if (assignment.length > 0) {
                                            var sg = assignment[0];
                                            $scope.insertEntity.assignmentName = sg.title;
                                        }
                                    } else {
                                        NotificationService.setWarningMessage("Pipeline is required");
                                    }
                                }

                                if (next) {
                                    if ($scope.insertEntity.activityID != undefined && $scope.insertEntity.activityID != '' && $scope.insertEntity.activityID != null) {
                                        var activity = $filter('filter')($scope.listActivityGroup.options, {id: $scope.insertEntity.activityID});
                                        if (activity.length > 0) {
                                            var sg = activity[0];
                                            $scope.insertEntity.activityname = sg.title;
                                        }
                                        if ($scope.insertEntity.sellingstepid != undefined && $scope.insertEntity.sellingstepid != '' && $scope.insertEntity.sellingstepid != null) {
                                            var sellingstep = $filter('filter')($scope.listSellingStep.options, {id: $scope.insertEntity.sellingstepid});
                                            if (sellingstep.length > 0) {
                                                var sg = sellingstep[0];
                                                $scope.insertEntity.sellingstepname = sg.title;
                                            }

                                            if ($scope.insertEntity.typeid != undefined && $scope.insertEntity.typeid != '' && $scope.insertEntity.typeid != null) {
                                                var type = $filter('filter')($scope.listType.options, {id: $scope.insertEntity.typeid});
                                                if (type.length > 0) {
                                                    var sg = type[0];
                                                    $scope.insertEntity.typename = sg.title;
                                                }

                                                if ($scope.insertEntity.resultID != undefined && $scope.insertEntity.resultID != '' && $scope.insertEntity.resultID != null) {
                                                    var result = $filter('filter')($scope.listResultGroup.options, {id: $scope.insertEntity.resultID});
                                                    if (result.length > 0) {
                                                        var sg = result[0];
                                                        $scope.insertEntity.resultname = sg.title;
                                                    }
                                                    if ($scope.insertEntity.description != undefined && $scope.insertEntity.description != '' && $scope.insertEntity.description != null) {
                                                        if ($scope.insertEntity.achievement != undefined && $scope.insertEntity.achievement != '' && $scope.insertEntity.achievement != null) {
                                                            if ($scope.insertEntity.nextactivitydateString != undefined && $scope.insertEntity.nextactivitydateString != '' && $scope.insertEntity.nextactivitydateString != null) {

                                                                if ($scope.insertEntity.nextactivitydescription != undefined && $scope.insertEntity.nextactivitydescription != '' && $scope.insertEntity.nextactivitydescription != null) {

                                                                    insert = true;

                                                                }
                                                                else {
                                                                    NotificationService.setWarningMessage("Next Activity Description is required");
                                                                }
                                                            }
                                                            else {
                                                                NotificationService.setWarningMessage("Next Activity Date is required");
                                                            }

                                                        }
                                                        else {
                                                            NotificationService.setWarningMessage("Achievement is required");
                                                        }
                                                    }

                                                    else {
                                                        NotificationService.setWarningMessage("Description is required");
                                                    }
                                                }
                                                else {
                                                    NotificationService.setWarningMessage("Result is required");
                                                }
                                            }
                                            else {
                                                NotificationService.setWarningMessage("Type is required");
                                            }
                                        }
                                        else {
                                            NotificationService.setWarningMessage("Selling Step is required");
                                        }
                                    }
                                    else {
                                        NotificationService.setWarningMessage("Category is required");
                                    }
                                }
                            }
                            else {
                                NotificationService.setWarningMessage("Serve Group is required");
                            }
                        }
                        else {
                            NotificationService.setWarningMessage("Correction Reason is required");
                        }
                        if (insert == true) {
                            var nextdatebc = new Date($scope.insertEntity.nextactivitydateString);
                            $scope.insertEntity.nextactivitydateString = moment(new Date(nextdatebc)).format("DD-MM-YYYY");
                            var confirm = function () {
                                var success_insert = function (data) {
                                    if (data.status == true) {

                                        NotificationService.setSuccessMessage("Insert Attendance Correction Success!");
                                        $timeout(function () {
                                            $window.location.reload();
                                        }, 1000);

                                    }
                                    else {
                                        NotificationService.setSuccessMessage(data.description);
                                    }

                                };
                                var error_insert = function (data) {
                                    //////console.log('insert error');
                                };
                                ////console.log("jeri" + JSON.stringify($scope.insertEntity));
                                AttendanceModuleFactory.insertNewAttendanceCorrection($scope.insertEntity).then(success_insert, error_insert);
                            }
                            UIkit.modal.confirm("Do you want to create Service Correction ?", confirm);
                        }
                    }
                }
            };

            $scope.simpanKoreksiAbsen = function () {
                var insert = false;
                var edit = false;
                var start = Date.parse($scope.startTime);
                var end = Date.parse($scope.endTime);
                var xx = moment(new Date(end)).format("DD-MM-YYYY HH:mm");
                if (end < start) {
                    NotificationService.setWarningMessage("Serve off more than Serve On");
                }
                else {
                    if ($scope.flag == "edit") {
                        if ($scope.insertEntity.koreksireasonId != undefined && $scope.insertEntity.koreksireasonId != '' && $scope.insertEntity.koreksireasonId != null) {
                            var correction = $filter('filter')($scope.listReasonGroup.options, {id: $scope.insertEntity.koreksireasonId});
                            if (correction.length > 0) {
                                var sg = correction[0];
                                $scope.insertEntity.koreksireasonName = sg.title;
                            }
                            if ($scope.insertEntity.resultID != undefined && $scope.insertEntity.resultID != '' && $scope.insertEntity.resultID != null) {
                                var result = $filter('filter')($scope.listResultGroup.options, {id: $scope.insertEntity.resultID});
                                if (result.length > 0) {
                                    var sg = result[0];
                                    $scope.insertEntity.resultname = sg.title;
                                }
                                if ($scope.endTime != undefined && $scope.endTime != '' && $scope.endTime != null) {
                                    //edit = true;
                                    if ($scope.insertEntity.description != undefined && $scope.insertEntity.description != '' && $scope.insertEntity.description != null) {
                                        //edit = true;
                                        if ($scope.insertEntity.achievement != undefined && $scope.insertEntity.achievement != '' && $scope.insertEntity.achievement != null) {
                                            edit = true;
                                        }
                                        else {
                                            NotificationService.setWarningMessage("Achievement is required");
                                        }
                                    }
                                    else {
                                        NotificationService.setWarningMessage("Description is required");
                                    }
                                }
                                else {
                                    NotificationService.setWarningMessage("End Date is required");
                                }
                            }
                            else {
                                NotificationService.setWarningMessage("Activity is required");
                            }
                        }
                        else {
                            NotificationService.setWarningMessage("Correction Reason is required");
                        }
                        if (edit == true) {
                            var editEntity = {
                                serveId: $scope.idserve,
                                koreksireasonId: $scope.insertEntity.koreksireasonId,
                                koreksireasonName: $scope.insertEntity.koreksireasonName,
                                // startTime: $scope.startTime,
                                endTime: end,
                                endTimeString: xx,
                                resultID: $scope.insertEntity.resultID,
                                resultname: $scope.insertEntity.resultname,
                                description: $scope.insertEntity.description,
                                achievement: $scope.insertEntity.achievement,
                                nextactivitydateString: "",
                                nextactivitydescription: ""
                            }

                            var confirm = function () {
                                var success_insert = function (data) {
                                    ////console.log("status controler" + data)
                                    if (data.status == true) {

                                        NotificationService.setSuccessMessage("Edit Data Success!");
                                        $timeout(function () {
                                            $window.location.reload();
                                        }, 1000);

                                    }
                                    else {
                                        NotificationService.setWarningMessage("error");
                                    }

                                };
                                var error_insert = function (data) {
                                    // //console.log('insert error');
                                };
                                ////console.log("jeri" + JSON.stringify(editEntity));
                                AttendanceModuleFactory.editAttendance(editEntity).then(success_insert, error_insert);

                            }
                            UIkit.modal.confirm("Do you want to edit this data ?", confirm);
                        }

                    }
                    else {
                        if ($scope.insertEntity.koreksireasonId != undefined && $scope.insertEntity.koreksireasonId != '' && $scope.insertEntity.koreksireasonId != null) {
                            //////console.log("masuk");
                            var correction = $filter('filter')($scope.listReasonGroup.options, {id: $scope.insertEntity.koreksireasonId});
                            if (correction.length > 0) {
                                var sg = correction[0];
                                //////console.log("Json stringify" + JSON.stringify(sg));
                                $scope.insertEntity.koreksireasonName = sg.title;
                            }

                            if ($scope.insertEntity.servegroupID != undefined && $scope.insertEntity.servegroupID != '' && $scope.insertEntity.servegroupID != null) {
                                var servegroup = $filter('filter')($scope.listServeGroup.options, {id: $scope.insertEntity.servegroupID});
                                if (servegroup.length > 0) {
                                    var sg = servegroup[0];
                                    $scope.insertEntity.servegroupname = sg.title;
                                }
                                var next = false;
                                if ($scope.insertEntity.servegroupID == 'INT') {
                                    next = true
                                } else {
                                    if ($scope.insertEntity.assignmentid != undefined && $scope.insertEntity.assignmentid != '' && $scope.insertEntity.assignmentid != null) {
                                        next = true;
                                        var assignment = $filter('filter')($scope.listProject.options, {id: $scope.insertEntity.assignmentid});
                                        if (assignment.length > 0) {
                                            var sg = assignment[0];
                                            $scope.insertEntity.assignmentName = sg.title;
                                        }
                                    } else {
                                        NotificationService.setWarningMessage("Project is required");
                                    }
                                }

                                if (next) {
                                    if ($scope.insertEntity.activityID != undefined && $scope.insertEntity.activityID != '' && $scope.insertEntity.activityID != null) {
                                        var activity = $filter('filter')($scope.listActivityGroup.options, {id: $scope.insertEntity.activityID});
                                        if (activity.length > 0) {
                                            var sg = activity[0];
                                            $scope.insertEntity.activityname = sg.title;
                                        }
                                        if ($scope.insertEntity.resultID != undefined && $scope.insertEntity.resultID != '' && $scope.insertEntity.resultID != null) {
                                            var result = $filter('filter')($scope.listResultGroup.options, {id: $scope.insertEntity.resultID});
                                            if (result.length > 0) {
                                                var sg = result[0];
                                                $scope.insertEntity.resultname = sg.title;
                                            }
                                            if ($scope.insertEntity.description != undefined && $scope.insertEntity.description != '' && $scope.insertEntity.description != null) {
                                                if ($scope.insertEntity.achievement != undefined && $scope.insertEntity.achievement != '' && $scope.insertEntity.achievement != null) {
                                                    insert = true;
                                                }
                                                else {
                                                    NotificationService.setWarningMessage("Achievement is required");
                                                }
                                            }
                                            else {
                                                NotificationService.setWarningMessage("Description is required");
                                            }
                                        }
                                        else {
                                            NotificationService.setWarningMessage("Result is required");
                                        }
                                    }
                                    else {

                                        NotificationService.setWarningMessage("Activity is required");

                                    }
                                }
                            }
                            else {
                                NotificationService.setWarningMessage("Serve Group is required");
                            }
                        }
                        else {
                            NotificationService.setWarningMessage("Correction Reason is required");
                        }

                        if (insert == true) {

                            var confirm = function () {
                                var success_insert = function (data) {
                                    if (data.status == true) {

                                        NotificationService.setSuccessMessage("Insert Attendance Correction Success!");
                                        $timeout(function () {
                                            $window.location.reload();
                                        }, 1000);

                                    }
                                    else {
                                        NotificationService.setSuccessMessage(data.description);
                                    }

                                };
                                var error_insert = function (data) {
                                    //////console.log('insert error');
                                };
                                ////console.log("jeri2" + JSON.stringify($scope.insertEntity));
                                AttendanceModuleFactory.insertNewAttendanceCorrection($scope.insertEntity).then(success_insert, error_insert);
                            }
                            UIkit.modal.confirm("Do you want to create Service Correction ?", confirm);
                        }
                        ;

                    }
                }
            };

            $scope.cancel = function () {
                $scope.calendarView = true;
                $scope.showDefaultPanel = false;
                $scope.showPanelForBCSales = false;
                $scope.detailtime = false;
                $scope.mode = 'month';
                $scope.flag = "netral";
                $('#calendar').fullCalendar('changeView', "month");
                $scope.startdate = false;
                $scope.endate = false;
                $scope.endtimebcdis = false;
                $scope.starttimebcdis = false;
                $scope.typebcdis = false;
                $scope.sellingstepbcdis = false;
                $scope.activitybcdis = false;
                $scope.projectbcdis = false;
                $scope.servegroupbcdis = false;
                $scope.showDefaultPanel = false;
                $scope.showPanelForBCSales = false;
                $scope.startdate = false;
                $scope.endate = false;
                $scope.starttimebcdis = false;
                $scope.endtimebcdis = false;
                $scope.servenonbcdis = false;
                $scope.projectnonbcdis = false;
                $scope.activitynonbcdis = false;
                $scope.startTime = "";
                $scope.endTime = "";
                $scope.insertEntity.koreksireasonId = "";
                $scope.insertEntity.servegroupID = "";
                $scope.insertEntity.assignmentid = "";
                $scope.insertEntity.activityID = "";
                $scope.insertEntity.resultID = "";
                $scope.insertEntity.description = "";
                $scope.insertEntity.achievement = "";
                $scope.insertEntity.nextactivitydescription = "";

            };
            $scope.getProjectGroup = function () {
                $scope.getPM();
            };

            $scope.changeServeGroup = function () {
                $scope.insertEntity.assignmentid = "";
                $scope.insertEntity.activityID = "";
                $scope.sellingstepid = "";

                $scope.insertEntity.directhead = $scope.dataemployee.employeeTemplate.directHead;
                $scope.insertEntity.directheadName = $scope.dataemployee.employeeTemplate.directHeadName;


                //////console.log(" $scope.request.servegroup;" + $scope.request.servegroup);
                if ($scope.insertEntity.servegroupID != null && $scope.insertEntity.servegroupID != '' && $scope.insertEntity.servegroupID != undefined) {
                    var servegroup = $filter('filter')($scope.listActivity, {servegroupid: $scope.insertEntity.servegroupID});

                    var role = $scope.dataemployee.employeeTemplate.customfield2;
                    if (role == 'BC' && $scope.insertEntity.servegroupID == 'SL') {//login custom field sebagai BC
                        if ($scope.insertEntity.servegroupID == 'INT') {
                            $scope.projecthide = false;

                        }
                        else {
                            $scope.projecthide = true;
                        }
                        $scope.calendarView = false;
                        $scope.showDefaultPanel = false;
                        $scope.showPanelForBCSales = true;
                        $scope.insertEntity.nextactivitydateString = new Date();
                    } else {
                        if ($scope.insertEntity.servegroupID == 'INT') {
                            $scope.projecthide = false;

                        }
                        else {
                            $scope.projecthide = true;
                        }
                        $scope.calendarView = false;
                        $scope.showDefaultPanel = true;
                        $scope.showPanelForBCSales = false;
                        $scope.insertEntity.nextactivitydateString = "";
                    }

                    if (servegroup.length > 0) {

                        var list = new Array();

                        for (var a = 0; a < servegroup.length; a++) {
                            var ga = servegroup[a];
                            var object = {
                                id: ga.id,
                                title: ga.name,
                                value: ga.id,
                                parent_id: "-"
                            };
                            list.push(object);
                        }

                        $scope.listActivityGroup.options = list;
                    }

                    var listProject = new Array();

                    if ($scope.insertEntity.servegroupID != 'INT') {
                        //////console.log("1")
                        var assignments = [];
                        if ($scope.insertEntity.servegroupID == 'PRJI' || $scope.insertEntity.servegroupID == 'PRJO') {
                            //////console.log("2")
                            assignments = $filter('filter')($scope.listAssignment, {type: '1'});
                        } else {
                            //////console.log("3")
                            assignments = $filter('filter')($scope.listAssignment, {type: '2'});
                        }

                        //////console.log("4")
                        for (var a = 0; a < assignments.length; a++) {
                            var ga = assignments[a];
                            var object = {
                                id: ga.assignmentNumber,
                                title: ga.assignmentNumber + ' (' + ga.name + ')',
                                value: ga.assignmentNumber,
                                parent_id: "-"
                            };
                            //////console.log("5: "+ga.assignmentNumber);
                            listProject.push(object);
                        }
                    }

                    $scope.listProject.options = listProject;
                }

            };

            $scope.DeletetimeSheet = function () {

                var entity = {
                    serveId: $scope.idserve
                };

                confirm = function () {
                    var success = function (data) {
                        NotificationService.setInfoMessage("Delete Success!");
                        $timeout(function () {
                            $window.location.reload();
                        }, 1000);

                    };

                    var error = function (data) {
                        $log.error("FAILED");
                    };

                    AttendanceModuleFactory.removeAttendance(entity).then(success, error);
                }

                UIkit.modal.confirm("Do you want to Delete This Timesheet ?", confirm)
            };


            $scope.edit = function () {
                $scope.flag = "edit";
                if ($scope.flag == "edit") {
                    $scope.detailtime = false;
                    $scope.startTime = new Date($scope.serveonlong);
                    $scope.endTime = new Date($scope.serveofflong);
                    $scope.insertEntity.koreksireasonId = $scope.kodereason;
                    $scope.insertEntity.servegroupID = $scope.servegroupid;
                    $scope.insertEntity.assignmentid = $scope.project;
                    $scope.insertEntity.activityID = $scope.activity;
                    $scope.insertEntity.resultID = $scope.hasil;
                    $scope.insertEntity.description = $scope.description1;
                    $scope.insertEntity.achievement = $scope.isiachieve;
                    $scope.insertEntity.typeid = $scope.namatipe;
                    $scope.insertEntity.sellingstepid = $scope.sellingstep;

                    $scope.insertEntity.nextactivitydateString = new Date($scope.datenext);
                    $scope.insertEntity.nextactivitydescription = $scope.desnext;

                    if ($scope.kodeserve == 'SL' || $scope.kodeserve == 'BC') {//login custom field sebagai BC
                        if ($scope.insertEntity.servegroupID == 'INT') {
                            $scope.projecthide = false;

                        }
                        else {
                            $scope.projecthide = true;
                        }
                        $scope.showDefaultPanel = false;
                        $scope.showPanelForBCSales = true;
                        $scope.descriptionbcdis = true;
                        $scope.nextactivitybcdis = true;
                        $scope.startdate = true;
                        $scope.endate = true;
                        $scope.endtimebcdis = false;
                        $scope.starttimebcdis = true;
                        $scope.typebcdis = true;
                        $scope.sellingstepbcdis = true;
                        $scope.resultbcdis = false;
                        $scope.nextactivitybcdis = false;
                        $scope.descriptionbcdis = false;
                        $scope.descriptionbcdis = false;
                        $scope.achievementbcdis = false;
                        $scope.projectbcdis = true;
                        $scope.servegroupbcdis = true;
                        $scope.activitybcdis = true;

                    } else {
                        if ($scope.insertEntity.servegroupID == 'INT') {
                            $scope.projecthide = false;

                        }
                        else {
                            $scope.projecthide = true;
                        }
                        $scope.showDefaultPanel = true;
                        $scope.showPanelForBCSales = false;
                        $scope.startdate = true;
                        $scope.endate = false;
                        $scope.servenonbcdis = true;
                        $scope.projectnonbcdis = true;

                        $scope.activitynonbcdis = true;
                        // $scope.activitynonbcdis = true;
                        //$scope.resultnonbcdis = true;
                        //$scope.descriptionnonbcdis = true;
                        //$scope.achievementnonbcdis = true;
                    }
                }


            };

            // new Date(Date.parse($scope.serveon));
            function addDays(theDate, days) {
                return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
            }
        }
    )
;
