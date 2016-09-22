var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
   
   // stores the value(true, false) of the checkboxes from the "Select Scenario Variables" section; it is used to verify 
    // whether a variable was selected as scenario or not
    var checkedBoxes = {
        "scenario": {
            "name": "",
            "desiredcapacity": "",
            "transhipment": "",
            "average_dwell": "",
            "peak_factor": "",
            "teu_factor": "",
            "number_qc": "",
            "waterside_peak": "",
            "landside_peak": "",
            "ref_widthm": "",
            "ref_widthb": "",
            "capacity_ws": "",
            "capacity_ls": "",
            "height": "",
            "max_occ": "",
            "apron_depth": "",
            "landside_depth": ""
        }
    };
	
    // stores the name of the variables that appear in the heading of the scenario table
    var tableHeaderNames = {
        "name": "Configuration Name",
        "desiredcapacity": "Desired Capacity",
        "transhipment": "Transhipment (%)",
        "average_dwell": "Average dwell(days):",
        "peak_factor": "Peak factor: ",
        "teu_factor": "TEU factor:",
        "number_qc": "Number of QC:",
        "waterside_peak": "Waterside peak: ",
        "landside_peak": "Landside peak: ",
        "ref_widthm": "Reference width (m)",
        "ref_widthb": "Reference width (bx):",
        "capacity_ws": "Capacity WS per mod:",
        "capacity_ls": "Capacity LS per mod (net bx/h):",
        "height": "Height:",
        "max_occ": "Max occ:",
        "apron_depth": "Apron depth:",
        "landside_depth": "Landside depth:"
    };

    // stores the name of the variables that appear in the heading of the scenario table, without name and desired capacity
    var scenarioVariablesNames = {
        "transhipment": "Transhipment (%)",
        "average_dwell": "Average dwell(days):",
        "peak_factor": "Peak factor: ",
        "teu_factor": "TEU factor:",
        "number_qc": "Number of QC:",
        "waterside_peak": "Waterside peak: ",
        "landside_peak": "Landside peak: ",
        "ref_widthm": "Reference width (m)",
        "ref_widthb": "Reference width (bx):",
        "capacity_ws": "Capacity WS per mod:",
        "capacity_ls": "Capacity LS per mod (net bx/h):",
        "height": "Height:",
        "max_occ": "Max occ:",
        "apron_depth": "Apron depth:",
        "landside_depth": "Landside depth:"
    };

    // stores the values of the fixed inputs that are set by the admin
    var admin_input = {
        "quay_length": "",
        "access_left": "",
        "access_right": "",
        "total_depth": "",
        "min_width_allowed": "",
        "max_width_allowed": ""
    };

    // stores the values of the inputs 
    var input_list = {
        "fixed": {
            "transhipment": undefined,
            "average_dwell": undefined,
            "peak_factor": undefined,
            "teu_factor": undefined,
            "desired_cap": undefined,
            "number_qc": undefined,
            "waterside_peak": undefined,
            "landside_peak": undefined,
            "ref_widthm": undefined,
            "ref_widthb": undefined,
            "capacity_ws": undefined,
            "capacity_ls": undefined,
            "height": undefined,
            "max_occ": undefined,
            "quay_length": "",
            "access_left": "",
            "access_right": "",
            "total_depth": "",
            "apron_depth": undefined,
            "landside_depth": undefined,
            "min_width_allowed": "",
            "max_width_allowed": ""
        },
        "scenario": []
    };

    // stores the value of the input fields from the login
    var user = {
        "username": "",
        "password": ""
    };

    // stores the value of the input fields from the register
    var newuser = {
        "username": "",
        "password": "",
        "firstname": "",
        "lastname": "",
        "email": ""
    };

    // stores the number of rows of the scenario table
    var numberOfScenarioRows = 1;

    // used to store the input values from the scenario table
    $scope.newObject = {};

    // number of rows of the scenario table, but as an array of objects,used for the ng-repeat
    $scope.rows = [{
        "rowNumber": numberOfScenarioRows
    }];
	//init first row from scenario table
    $scope.newObject[numberOfScenarioRows] = {
        "row": numberOfScenarioRows
    };
	
	//the popup window
	var myWindow;
	// stores the names that we need to fill the table
	var checkedScenario;
    // set the remove column from the scenario table to be hidden until the select row button is pressed
    $scope.selectRowVisibility = "hidden";
    // set the save box  to be hidden until the Save submenu is chosen
    $scope.saveText = "none";
    // the admin has one more submenu, the Fixed Inputs, in addition to the user
    $scope.showAdminInput = "hidden";
	// initially the generate chart button is hidden until the generate table button is pressed
	$scope.chartButtonVisibility="hidden";

	
    //we use the same table with the same input fields for all different categories,such as traffic characteristics, stack characteristics, terminal area- depth and fixed inputs.
    //this function clears the fields every time a new category is opened.
    function clearField() {
        $scope.input1 = "";
        $scope.input2 = "";
        $scope.input3 = "";
        $scope.input4 = "";
        $scope.input5 = "";
        $scope.input6 = "";
        $scope.input7 = "";
    };

    $scope.addRow = function() {
        numberOfScenarioRows++;
		
        $scope.rows.push({
            "rowNumber": numberOfScenarioRows
        });
		
        $scope.newObject[numberOfScenarioRows] = {
            "row": numberOfScenarioRows
        };
    }

	$scope.selectRow = function(){
		$scope.selectRowVisibility="display";
	}

	//it executes when the remove button is pressed 	
	$scope.removeRow = function() {
		var selected=0;
		for(var i =1;i<=$scope.rows.length;i++){
			if(document.getElementById("chartCheckBox."+i).checked==true) selected++;
		}
		if(selected!=$scope.rows.length){
			var index=0;
			for(var i=1;i<=numberOfScenarioRows;i++){
				index++;
				if(document.getElementById("chartCheckBox."+index).checked==true){
					document.getElementById("scenario-table").deleteRow(i);
					//removes i-1 element from the rows array 
					$scope.rows.splice(i - 1, 1);
					//  the variable rowNumber is the index of the row and after an element is removed from the array, the index is decreased 
					for (var j = i - 1; j < $scope.rows.length; j++) {
						$scope.rows[j].rowNumber = j + 1;
					}
					// in newobject we bring all the elements one position ahead
					for (var j = i; j <= $scope.rows.length; j++) {
						$scope.newObject[j] = $scope.newObject[j + 1];
					}
					// delete last object from the newobject array
					delete $scope.newObject[numberOfScenarioRows];
					numberOfScenarioRows--;
					i--;
					}
				}
			$scope.selectRowVisibility="hidden";
		}else{
			alert("Please don't remove all the rows!");
			$scope.selectRowVisibility="hidden";
			for(var i = 1 ; i<=$scope.rows.length;i++){
				document.getElementById("chartCheckBox."+i).checked=false;
			}
		}

	}	
		
		
		
    //when a variable is checked as scenario, the function puts in the sidebar, near the corresponding variable,the output "scenario"
    // this function is called in the apply_scenario function
    sidebar_scenario = function() {
        if (checkedBoxes.scenario.transhipment == true) {
            $scope.transhipment = "scenario";
        } else {
            $scope.transhipment = input_list.fixed.transhipment;
        }
        if (checkedBoxes.scenario.average_dwell == true) {
            $scope.average_dwell = "scenario";
        } else {
            $scope.average_dwell = input_list.fixed.average_dwell;
        }
        if (checkedBoxes.scenario.peak_factor == true) {
            $scope.peak_factor = "scenario";
        } else {
            $scope.peak_factor = input_list.fixed.peak_factor ;
        }
        if (checkedBoxes.scenario.teu_factor == true) {
            $scope.teu_factor = "scenario";
        } else {
            $scope.teu_factor = input_list.fixed.teu_factor;
        }
        if (checkedBoxes.scenario.number_qc == true) {
            $scope.number_qc = "scenario";
        } else {
            $scope.number_qc =input_list.fixed.number_qc ;
        }
        if (checkedBoxes.scenario.waterside_peak == true) {
            $scope.waterside_peak = "scenario";
        } else {
            $scope.waterside_peak = input_list.fixed.waterside_peak;
        }
        if (checkedBoxes.scenario.landside_peak == true) {
            $scope.landside_peak = "scenario";
        } else {
            $scope.landside_peak = input_list.fixed.landside_peak;
        }
        if (checkedBoxes.scenario.ref_widthm == true) {
            $scope.ref_widthm = "scenario";
        } else {
            $scope.ref_widthm = input_list.fixed.ref_widthm;
        }
        if (checkedBoxes.scenario.ref_widthb == true) {
            $scope.ref_widthb = "scenario";
        } else {
            $scope.ref_widthb = input_list.fixed.ref_widthb;
        }
        if (checkedBoxes.scenario.capacity_ws == true) {
            $scope.capacity_ws = "scenario";
        } else {
            $scope.capacity_ws = input_list.fixed.capacity_ws;
        }
        if (checkedBoxes.scenario.capacity_ls == true) {
            $scope.capacity_ls = "scenario";
        } else {
            $scope.capacity_ls = input_list.fixed.capacity_ls;
        }
        if (checkedBoxes.scenario.height == true) {
            $scope.height = "scenario";
        } else {
            $scope.height = input_list.fixed.height;
        }
        if (checkedBoxes.scenario.max_occ == true) {
            $scope.max_occ = "scenario";
        } else {
            $scope.max_occ = input_list.fixed.max_occ;
        }
        if (checkedBoxes.scenario.apron_depth == true) {
            $scope.apron_depth = "scenario";
        } else {
            $scope.apron_depth = input_list.fixed.apron_depth;
        }
        if (checkedBoxes.scenario.landside_depth == true) {
            $scope.landside_depth = "scenario";
        } else {
            $scope.landside_depth = input_list.fixed.landside_depth;
        }
    }
		
	function colorBorder(){
		if ((( $scope.input1 == "")||($scope.input1==undefined))&& (document.getElementById("input1").placeholder !="scenario")){
			document.getElementById("input1").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input1").style.border = "none";
		}
		if ((( $scope.input2 == "")||($scope.input2==undefined))&& (document.getElementById("input2").placeholder !="scenario")&& ($scope.titleBody != 'Terminal area- depth')){
			document.getElementById("input2").style.border = "3px solid #FD3434";
		} 
		else {
			document.getElementById("input2").style.border = "none";
		}
		if ((( $scope.input3 == "")||($scope.input3==undefined))&& (document.getElementById("input3").placeholder !="scenario")){
			document.getElementById("input3").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input3").style.border = "none";
		}
		if ((( $scope.input4 == "")||($scope.input4==undefined))&& (document.getElementById("input4").placeholder !="scenario")){
			document.getElementById("input4").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input4").style.border = "none";
		}
		if ((( $scope.input5 == "")||($scope.input5==undefined))&& (document.getElementById("input5").placeholder !="scenario")&& ($scope.titleBody != 'Terminal area- depth')){
			document.getElementById("input5").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input5").style.border = "none";
		}
		
		if ((( $scope.input6 == "")||($scope.input6==undefined))&& (document.getElementById("input6").placeholder !="scenario") && ($scope.titleBody != 'Terminal area- depth')){
			document.getElementById("input6").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input6").style.border = "none";
		}
		if ((( $scope.input7 == "")||($scope.input7==undefined))&& (document.getElementById("input7").placeholder !="scenario")){
			document.getElementById("input7").style.border = "3px solid #FD3434";
		}
		else {
			document.getElementById("input7").style.border = "none";
		}
	}	
	
    //this function is executed every time the apply button from Set Inputs submenu is pressed.
    $scope.apply = function() {
        // depending on the title, the corresponding instructions are executed
        if ($scope.titleBody === 'Traffic Characteristics') {
			if(($scope.input1>0 || document.getElementById("input1").placeholder =="scenario") && ($scope.input2>0|| document.getElementById("input2").placeholder =="scenario") && 
			($scope.input3>0 || document.getElementById("input3").placeholder =="scenario") && ($scope.input4>0 || document.getElementById("input4").placeholder =="scenario") && 
			($scope.input5>0 || document.getElementById("input5").placeholder =="scenario") && ($scope.input6>0 || document.getElementById("input6").placeholder =="scenario") && 
			($scope.input7>0|| document.getElementById("input7").placeholder =="scenario")){
				// the variables from the left sidebar take the corresponding values inserted by the user in the inputs
				colorBorder();
				if(document.getElementById("input1").placeholder =="scenario"){
					$scope.transhipment = "scenario";
				}
				else{
					$scope.transhipment = $scope.input1;
					input_list.fixed.transhipment = $scope.input1;
				}
				if(document.getElementById("input2").placeholder =="scenario"){
					 $scope.average_dwell = "scenario";
				}
				else{
					$scope.average_dwell = $scope.input2;
					input_list.fixed.average_dwell = $scope.input2;
				}
				if(document.getElementById("input3").placeholder =="scenario"){
					$scope.peak_factor = "scenario";
				}
				else{
					$scope.peak_factor = $scope.input3;
					input_list.fixed.peak_factor = $scope.input3;
				}
				if(document.getElementById("input4").placeholder =="scenario"){
					$scope.teu_factor = "scenario";
				}
				else{
					$scope.teu_factor = $scope.input4;
					input_list.fixed.teu_factor = $scope.input4;
				}
				if(document.getElementById("input5").placeholder =="scenario"){
					$scope.number_qc = "scenario";
				}
				else{
					$scope.number_qc = $scope.input5;
					input_list.fixed.number_qc = $scope.input5;
				}
				if(document.getElementById("input6").placeholder =="scenario"){
					$scope.waterside_peak = "scenario";
				}
				else{
					$scope.waterside_peak = $scope.input6;
					input_list.fixed.waterside_peak = $scope.input6;
				}
				if(document.getElementById("input7").placeholder =="scenario"){
					$scope.landside_peak = "scenario";
				}
				else{
					$scope.landside_peak = $scope.input7;
					input_list.fixed.landside_peak = $scope.input7;
				}
			}else{	
				colorBorder();
			}	
        } else if ($scope.titleBody === 'Stack Characteristics') {
			if(($scope.input1>0 || document.getElementById("input1").placeholder =="scenario") && ($scope.input2>0|| document.getElementById("input2").placeholder =="scenario") && 
			($scope.input3>0 || document.getElementById("input3").placeholder =="scenario") && ($scope.input4>0 || document.getElementById("input4").placeholder =="scenario") && 
			($scope.input5>0 || document.getElementById("input5").placeholder =="scenario") && ($scope.input6>0 || document.getElementById("input6").placeholder =="scenario")){
				// the variables from the left sidebar take the corresponding values inserted by the user in the inputs
				colorBorder();
				if(document.getElementById("input1").placeholder =="scenario"){
					$scope.ref_widthm = "scenario";
				}
				else{
					$scope.ref_widthm = $scope.input1;
					input_list.fixed.ref_widthm = $scope.input1;
				}
				if(document.getElementById("input2").placeholder =="scenario"){
					 $scope.ref_widthb = "scenario";
				}
				else{
					$scope.ref_widthb = $scope.input2;
					input_list.fixed.ref_widthb = $scope.input2;
				}
				if(document.getElementById("input3").placeholder =="scenario"){
					$scope.capacity_ws = "scenario";
				}
				else{
					$scope.capacity_ws = $scope.input3;
					input_list.fixed.capacity_ws = $scope.input3;
				}
				if(document.getElementById("input4").placeholder =="scenario"){
					$scope.capacity_ls = "scenario";
				}
				else{
					$scope.capacity = $scope.input4;
					input_list.fixed.capacity_ls = $scope.input4;
				}
				if(document.getElementById("input5").placeholder =="scenario"){
					$scope.height = "scenario";
				}
				else{
					$scope.height= $scope.input5;
					input_list.fixed.height = $scope.input5;
				}if(document.getElementById("input6").placeholder =="scenario"){
					$scope.max_occ = "scenario";
				}
				else{
					$scope.max_occ = $scope.input6;
					input_list.fixed.max_occ = $scope.input6;
				}	
			} else {
				colorBorder();
			}
        } else if ($scope.titleBody === 'Fixed Inputs') {
			if(($scope.input1>0 || document.getElementById("input1").placeholder =="scenario") && ($scope.input2>0|| document.getElementById("input2").placeholder =="scenario") && 
			($scope.input3>0 || document.getElementById("input3").placeholder =="scenario") && ($scope.input4>0 || document.getElementById("input4").placeholder =="scenario") && 
			($scope.input5>0 || document.getElementById("input5").placeholder =="scenario") && ($scope.input6>0 || document.getElementById("input6").placeholder =="scenario") ){
				// the variables from the left sidebar take the corresponding values inserted by the user in the inputs
				colorBorder();
				$scope.min_width_allowed = $scope.input1;
				$scope.max_width_allowed = $scope.input2;
				$scope.quay_length = $scope.input3;
				$scope.access_left = $scope.input4;
				$scope.access_right = $scope.input5;
				$scope.total_depth = $scope.input6;
				// Because fixed inputs is submenu of the admin menu, the input values are stored in a different JSON
				admin_input.min_width_allowed = $scope.input1;
				admin_input.max_width_allowed = $scope.input2;
				admin_input.quay_length = $scope.input3;
				admin_input.access_left = $scope.input4;
				admin_input.access_right = $scope.input5;
				admin_input.total_depth = $scope.input6;
				admin_input.username=user.username;
				
				input_list.fixed.min_width_allowed = admin_input.min_width_allowed;
				input_list.fixed.max_width_allowed = admin_input.max_width_allowed;
				input_list.fixed.quay_length = admin_input.quay_length;
				input_list.fixed.access_left = admin_input.access_left;
				input_list.fixed.access_right = admin_input.access_right;
				input_list.fixed.total_depth = admin_input.total_depth;
				// every time the apply button from fixed inputs submenu is pressed, the JSON admin_input is sent to the server in order to be updated
				$http.post('/updateInputs', admin_input);
			}else{
				colorBorder();
			}

        } else if ($scope.titleBody == 'Terminal area- depth') {
			if(($scope.input3>0 || document.getElementById("input3").placeholder =="scenario") && ($scope.input4>0 || document.getElementById("input4").placeholder =="scenario")){
				// the variables from the left sidebar take the corresponding values inserted by the user in the inputs
				colorBorder();
				if(document.getElementById("input3").placeholder =="scenario"){
					$scope.apron_depth = "scenario";
				}
				else{
					$scope.apron_depth = $scope.input3;
					input_list.fixed.apron_depth = $scope.input3;
				}
				if(document.getElementById("input4").placeholder =="scenario"){
					 $scope.landside_depth = "scenario";
				}
				else{
					$scope.landside_depth = $scope.input4;
					input_list.fixed.landside_depth = $scope.input4;
				}
				//the value of the Resulting Stack Depth(m) is calculated and shown to the user
				document.getElementById("input5").disabled = true;
				var resulting_stack_depth = input_list.fixed.total_depth - input_list.fixed.apron_depth - input_list.fixed.landside_depth;
				document.getElementById("input5").placeholder = resulting_stack_depth;
				//the value of the Resulting Stack Depth(TEU) is calculated and shown to the user
				document.getElementById("input6").disabled = true;
				document.getElementById("input6").placeholder = Math.floor(resulting_stack_depth / 6.5);
			}else{
				colorBorder();
			}
        }
    };

    // this function is executed when the admin chooses the Fixed Inputs submenu
    $scope.fixed_inputs = function() {

        //because there is only one page, the corresponding section is displayed, while the others are hidden
        document.getElementById('home').style.display = 'none';
        document.getElementById('input_table_section').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';

        // the title and the labels' value are set accordingly
        $scope.titleBody = "Fixed Inputs";
        $scope.l1 = "Minimum width allowed:";
        $scope.l2 = "Maximum width allowed:";
        $scope.l3 = "Quay length (m): ";
        $scope.l4 = "Access left: ";
        $scope.l5 = "Access right: ";
        $scope.l6 = "Total depth: ";
		document.getElementById("input1").style.border = "none";
		document.getElementById("input2").style.border = "none";
		document.getElementById("input3").style.border = "none";
		document.getElementById("input4").style.border = "none";
		document.getElementById("input5").style.border = "none";
		document.getElementById("input6").style.border = "none";
		document.getElementById("input7").style.border = "none";

        // the fields are cleared of the previous values
        clearField();
        // the corresponding inputs are enabled; when the admin returns to a certain input category, 
        // if there are previously saved values of the inputs, they are shown.
        document.getElementById("input1").disabled = false;
        $scope.input1 = input_list.fixed.min_width_allowed;
        document.getElementById("input2").disabled = false;
        $scope.input2 = input_list.fixed.max_width_allowed;
        document.getElementById("input3").disabled = false;
        $scope.input3 = input_list.fixed.quay_length;
        document.getElementById("input4").disabled = false;
        $scope.input4 = input_list.fixed.access_left;
        document.getElementById("input5").disabled = false;
        $scope.input5 = input_list.fixed.access_right;
        document.getElementById("input6").disabled = false;
        $scope.input6 = input_list.fixed.total_depth;

        // the maximum number of inputs from a category is 7 - Traffic Characteristics. 
        // But for other categories there are less inputs, thus we hide some input fields
        $scope.visibility1 = "display";
        $scope.visibility2 = "display";
        $scope.visibility3 = "display";
        $scope.visibility4 = "display";
        $scope.visibility5 = "display";
        $scope.visibility6 = "display";
        $scope.visibility7 = "hidden";
    };


    // this function is executed when the Traffic Characteristics submenu is chosen
    $scope.traffic = function() {

        //because there is only one page, the corresponding section is displayed, while the others are hidden
        document.getElementById('home').style.display = 'none';
        document.getElementById('input_table_section').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';

        // the title and the labels' value are set accordingly
        $scope.titleBody = "Traffic Characteristics";
        $scope.l1 = "Transhipment (%):";
        $scope.l2 = "Average dwell(days): ";
        $scope.l3 = "Peak factor (net bx/h): ";
        $scope.l4 = "TEU factor:  ";
        $scope.l5 = "Number of QC's:  ";
        $scope.l6 = "Waterside peak:  ";
        $scope.l7 = "Landside peak:  ";

        //the fields are cleared of the previous values
        clearField();
		document.getElementById("input1").style.border = "none";
		document.getElementById("input2").style.border = "none";
		document.getElementById("input3").style.border = "none";
		document.getElementById("input4").style.border = "none";
		document.getElementById("input5").style.border = "none";
		document.getElementById("input6").style.border = "none";
		document.getElementById("input7").style.border = "none";
        //the corresponding inputs are enabled; when the user returns to a certain input category, if there are previously saved values of the inputs, they are shown
        //if the input was selected as scenario variable, the input field is disabled and it takes the value "scenario"
        document.getElementById("input1").disabled = false;
        if (checkedBoxes.scenario.transhipment == true) {
            document.getElementById("input1").disabled = true;
            document.getElementById("input1").placeholder = "scenario";
        } else {
            document.getElementById("input1").placeholder = "";
            document.getElementById("input1").disabled = false;
            $scope.input1 = input_list.fixed.transhipment;
        }
        document.getElementById("input2").disabled = false;
        if (checkedBoxes.scenario.average_dwell == true) {
            document.getElementById("input2").disabled = true;
            document.getElementById("input2").placeholder = "scenario";
        } else {
            document.getElementById("input2").placeholder = "";
            document.getElementById("input2").disabled = false;
            $scope.input2 = input_list.fixed.average_dwell;
        }
        document.getElementById("input3").disabled = false;
        if (checkedBoxes.scenario.peak_factor == true) {
            document.getElementById("input3").disabled = true;
            document.getElementById("input3").placeholder = "scenario";
        } else {
            document.getElementById("input3").placeholder = "";
            document.getElementById("input3").disabled = false;
            $scope.input3 = input_list.fixed.peak_factor;
        }
        document.getElementById("input4").disabled = false;
        if (checkedBoxes.scenario.teu_factor == true) {
            document.getElementById("input4").disabled = true;
            document.getElementById("input4").placeholder = "scenario";
        } else {
            document.getElementById("input4").placeholder = "";
            document.getElementById("input4").disabled = false;
            $scope.input4 = input_list.fixed.teu_factor;
        }
        document.getElementById("input5").disabled = false;
        if (checkedBoxes.scenario.number_qc == true) {
            document.getElementById("input5").disabled = true;
            document.getElementById("input5").placeholder = "scenario";
        } else {
            document.getElementById("input5").placeholder = "";
            document.getElementById("input5").disabled = false;
            $scope.input5 = input_list.fixed.number_qc;
        }
        document.getElementById("input6").disabled = false;
        if (checkedBoxes.scenario.waterside_peak == true) {
            document.getElementById("input6").disabled = true;
            document.getElementById("input6").placeholder = "scenario";
        } else {
            document.getElementById("input6").placeholder = "";
            document.getElementById("input6").disabled = false;
            $scope.input6 = input_list.fixed.waterside_peak;
        }
        document.getElementById("input7").disabled = false;
        if (checkedBoxes.scenario.landside_peak == true) {
            document.getElementById("input7").disabled = true;
            document.getElementById("input7").placeholder = "scenario";
        } else {
            document.getElementById("input7").placeholder = "";
            document.getElementById("input7").disabled = false;
            $scope.input7 = input_list.fixed.landside_peak;
        }

        $scope.visibility1 = "display";
        $scope.visibility2 = "display";
        $scope.visibility3 = "display";
        $scope.visibility4 = "display";
        $scope.visibility5 = "display";
        $scope.visibility6 = "display";
        $scope.visibility7 = "display";

    };

    // this function is executed when the Stack Characteristics submenu is chosen
    $scope.stack = function() {

        //because there is only one page, the corresponding section is displayed, while the others are hidden
        document.getElementById('home').style.display = 'none';
        document.getElementById('input_table_section').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';

        // the title and the labels' value are set accordingly
        $scope.titleBody = "Stack Characteristics";
        $scope.l1 = "Reference width (m):";
        $scope.l2 = "Reference width (bx):";
        $scope.l3 = "Capacity WS per module: ";
        $scope.l4 = "Capacity LS per module: ";
        $scope.l5 = "Height (bx): ";
        $scope.l6 = "Maximum occupancy: ";

        //the fields are cleared of the previous values
        clearField();
		document.getElementById("input1").style.border = "none";
		document.getElementById("input2").style.border = "none";
		document.getElementById("input3").style.border = "none";
		document.getElementById("input4").style.border = "none";
		document.getElementById("input5").style.border = "none";
		document.getElementById("input6").style.border = "none";
		document.getElementById("input7").style.border = "none";
        //the corresponding inputs are enabled; when the user returns to a certain input category, if there are previously saved values of the inputs, they are shown
        //if the input was selected as scenario variable, the input field is disabled and it takes the value "scenario"
        document.getElementById("input1").disabled = false;
        if (checkedBoxes.scenario.ref_widthm == true) {
            document.getElementById("input1").disabled = true;
            document.getElementById("input1").placeholder = "scenario";
        } else {
            document.getElementById("input1").placeholder = "";
            document.getElementById("input1").disabled = false;
            $scope.input1 = input_list.fixed.ref_widthm;
        }
        document.getElementById("input2").disabled = false;
        if (checkedBoxes.scenario.ref_widthb == true) {
            document.getElementById("input2").disabled = true;
            document.getElementById("input2").placeholder = "scenario";
        } else {
            document.getElementById("input2").placeholder = "";
            document.getElementById("input2").disabled = false;
            $scope.input2 = input_list.fixed.ref_widthb;
        }
        document.getElementById("input3").disabled = false;
        if (checkedBoxes.scenario.capacity_ws == true) {
            document.getElementById("input3").disabled = true;
            document.getElementById("input3").placeholder = "scenario";
        } else {
            document.getElementById("input3").placeholder = "";
            document.getElementById("input3").disabled = false;
            $scope.input3 = input_list.fixed.capacity_ws;
        }
        document.getElementById("input4").disabled = false;
        if (checkedBoxes.scenario.capacity_ls == true) {
            document.getElementById("input4").disabled = true;
            document.getElementById("input4").placeholder = "scenario";
        } else {
            document.getElementById("input4").placeholder = "";
            document.getElementById("input4").disabled = false;
            $scope.input4 = input_list.fixed.capacity_ls;
        }
        document.getElementById("input5").disabled = false;
        if (checkedBoxes.scenario.height == true) {
            document.getElementById("input5").disabled = true;
            document.getElementById("input5").placeholder = "scenario";
        } else {
            document.getElementById("input5").placeholder = "";
            document.getElementById("input5").disabled = false;
            $scope.input5 = input_list.fixed.height;
        }
        document.getElementById("input6").disabled = false;
        if (checkedBoxes.scenario.max_occ == true) {
            document.getElementById("input6").disabled = true;
            document.getElementById("input6").placeholder = "scenario";
        } else {
            document.getElementById("input6").placeholder = "";
            document.getElementById("input6").disabled = false;
            $scope.input6 = input_list.fixed.max_occ;
        }

        $scope.visibility1 = "display";
        $scope.visibility2 = "display";
        $scope.visibility3 = "display";
        $scope.visibility4 = "display";
        $scope.visibility5 = "display";
        $scope.visibility6 = "display";
        $scope.visibility7 = "hidden";

    };

    // this function is executed when the Terminal Area- Depth submenu is chosen
    $scope.ta_depth = function() {
        //because there is only one page, the corresponding section is displayed, while the others are hidden
        document.getElementById('home').style.display = 'none';
        document.getElementById('input_table_section').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';

        // the title and the labels' value are set accordingly
        $scope.titleBody = "Terminal area- depth";
        $scope.l2 = "Total depth:";
        $scope.l3 = "Apron depth:";
        $scope.l4 = "Landside depth: ";
        $scope.l5 = "Resulting stack (m):";
        $scope.l6 = "Resulting stack (TEU): ";

        //the fields are cleared of the previous values
        clearField();
		document.getElementById("input1").style.border = "none";
		document.getElementById("input2").style.border = "none";
		document.getElementById("input3").style.border = "none";
		document.getElementById("input4").style.border = "none";
		document.getElementById("input5").style.border = "none";
		document.getElementById("input6").style.border = "none";
		document.getElementById("input7").style.border = "none";
        //the total_depth field can be fixed only by the admin, so it is disabled and it takes the corresponding value
        document.getElementById("input2").disabled = true;
        document.getElementById("input2").placeholder = input_list.fixed.total_depth;

        //the corresponding inputs are enabled; when the user returns to a certain input category, if there are previously saved values of the inputs, they are shown
        //if the input was selected as scenario variable, the input field is disabled and it takes the value "scenario"
        document.getElementById("input3").disabled = false;
        if (checkedBoxes.scenario.apron_depth == true) {
            document.getElementById("input3").disabled = true;
            document.getElementById("input3").placeholder = "scenario";
        } else {
            document.getElementById("input3").placeholder = "";
            document.getElementById("input3").disabled = false;
            $scope.input3 = input_list.fixed.apron_depth;
        }
        document.getElementById("input4").disabled = false;
        if (checkedBoxes.scenario.landside_depth == true) {
            document.getElementById("input4").disabled = true;
            document.getElementById("input4").placeholder = "scenario";
        } else {
            document.getElementById("input4").placeholder = "";
            document.getElementById("input4").disabled = false;
            $scope.input4 = input_list.fixed.landside_depth;
        }

        //the value of the Resulting Stack Depth(m) is calculated and shown to the user
        document.getElementById("input5").disabled = true;
        var resulting_stack_depth = input_list.fixed.total_depth - input_list.fixed.apron_depth - input_list.fixed.landside_depth;
        document.getElementById("input5").placeholder = resulting_stack_depth;
        //the value of the Resulting Stack Depth(TEU) is calculated and shown to the user
        document.getElementById("input6").disabled = true;
        document.getElementById("input6").placeholder = Math.floor(resulting_stack_depth / 6.5);

        $scope.visibility1 = "hidden";
        $scope.visibility2 = "display";
        $scope.visibility3 = "display";
        $scope.visibility4 = "display";
        $scope.visibility5 = "display";
        $scope.visibility6 = "display";
        $scope.visibility7 = "hidden";
    };

    //the home function is executed when the Home submenu is selected
    $scope.home = function() {
        document.getElementById('input_table_section').style.display = 'none';
        document.getElementById('home').style.display = 'inline';
        document.getElementById('left-sidebar').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';
    }

    //the login function is executed when the Sign in button is pressed
    $scope.login = function() {

        //the username and password are saved in the user JSON
        user.username = $scope.username;
        user.password = $scope.password;
        $http.post('/login', user).success(function(response) {
            // if the admin logs in the corresponding sections are displayed
            if (response.user == "admin") {
                // in addition to the user, the admin has the Fixed Input submenu
                $scope.showAdminInput = "display";
                document.getElementById('menu').style.display = 'block';
                document.getElementById('login_box').style.display = 'none';
                document.getElementById('home').style.display = 'inline';
                // wrapper refers to the content of the left sidebar
                document.getElementById('wrapper').style.display = 'inline';
                document.getElementById('register_box').style.display = 'none';
                document.getElementById('login_umessage').style.display = 'none';
                document.getElementById('register_smessage').style.display = 'none';
                document.getElementById('register_umessage').style.display = 'none';
                document.getElementById('register_umessage1').style.display = 'none';
                document.getElementById('register_umessage2').style.display = 'none';
                document.getElementById('register_umessage3').style.display = 'none';
                // wrapper2 refers to the content of the right sidebar that shows Load Input States list
                document.getElementById('wrapper2').style.display = 'inline';
                // the elements of Load Input States list are blocked, they will be accessible only when the admin chooses the Load Input States submenu
                document.getElementById('wrapper2').style.cursor = "not-allowed";
                document.getElementById("wrapper2").style.pointerEvents = "none";
                // this function is called in order for the scenario table to be displayed when the admin logs in 
                applyScenario();
                // if the user logs in the corresponding sections are displayed
            } else if (response.user != "") {
                $scope.showAdminInput = "hidden";
                document.getElementById('menu').style.display = 'block';
                document.getElementById('login_box').style.display = 'none';
                document.getElementById('home').style.display = 'inline';
                // wrapper refers to the content of the left sidebar
                document.getElementById('wrapper').style.display = 'inline';
                document.getElementById('register_box').style.display = 'none';
                document.getElementById('login_umessage').style.display = 'none';
                document.getElementById('register_smessage').style.display = 'none';
                document.getElementById('register_umessage').style.display = 'none';
                document.getElementById('register_umessage1').style.display = 'none';
                document.getElementById('register_umessage2').style.display = 'none';
                document.getElementById('register_umessage3').style.display = 'none';
                // wrapper2 refers to the content of the right sidebar that shows Load Input States list
                document.getElementById('wrapper2').style.display = 'inline';
                // the elements of Load Input States list are blocked, they will be accessible only when the admin chooses the Load Input States submenu
                document.getElementById('wrapper2').style.cursor = "not-allowed";
                document.getElementById("wrapper2").style.pointerEvents = "none";
                // this function is called in order for the scenario table to be displayed when the user logs in 
                applyScenario();
                // if the login is unsuccessful, the corresponding message is shown
            } else {
                document.getElementById('login_umessage').style.display = 'block';
                document.getElementById('register_umessage').style.display = 'none';
                document.getElementById('register_umessage1').style.display = 'none';
                document.getElementById('register_umessage2').style.display = 'none';
                document.getElementById('register_umessage3').style.display = 'none';
            }

            // the value of the fixed inputs is stored in the input_list.fixed JSON
            input_list.fixed.min_width_allowed = response.inputs.min_width_allowed;
            input_list.fixed.max_width_allowed = response.inputs.max_width_allowed;
            input_list.fixed.quay_length = response.inputs.quay_length;
            input_list.fixed.access_left = response.inputs.access_left;
            input_list.fixed.access_right = response.inputs.access_right;
            input_list.fixed.total_depth = response.inputs.total_depth;
            //fixed inputs are shown in the left sidebar
            $scope.min_width_allowed = input_list.fixed.min_width_allowed;
            $scope.max_width_allowed = input_list.fixed.max_width_allowed;
            $scope.quay_length = input_list.fixed.quay_length;
            $scope.access_left = input_list.fixed.access_left;
            $scope.access_right = input_list.fixed.access_right;
            $scope.total_depth = input_list.fixed.total_depth;
            //loads stores the number of configurations that were previously saved by the current user and can be loaded
            $scope.loads = response.savedConfigs;
        });
    }

    //the register function is executed when the Sign up button is pressed
    $scope.register = function() {
        //the corresponding fields (Username, Password, First name, Last name, Email) are saved in the newuser JSON
        newuser.username = $scope.rusername;
        newuser.password = $scope.rpassword;
        newuser.firstname = $scope.firstName;
        newuser.lastname = $scope.lastName;
        newuser.email = $scope.email;

        // If one of the required fields is empty, the corresponding unsuccessful registration message is shown
        if (($scope.rusername == undefined) || ($scope.rpassword == undefined) || ($scope.email == undefined) || ($scope.rconfirmPassword == undefined)) {
            document.getElementById('login_umessage').style.display = 'none';
            document.getElementById('register_umessage').style.display = 'block';
            document.getElementById('register_smessage').style.display = 'none';
            document.getElementById('register_umessage1').style.display = 'none';
            document.getElementById('register_umessage2').style.display = 'none';
            document.getElementById('register_umessage3').style.display = 'none';

            // If the email field is not valid, the corresponding unsuccessful registration message is shown
        } else if ($scope.email.indexOf('@') == -1) {
            document.getElementById('login_umessage').style.display = 'none';
            document.getElementById('register_smessage').style.display = 'none';
            document.getElementById('register_umessage').style.display = 'none';
            document.getElementById('register_umessage1').style.display = 'block';
            document.getElementById('register_umessage2').style.display = 'none';
            document.getElementById('register_umessage3').style.display = 'none';

            // If the password does not match with the confirmed password, the corresponding unsuccessful registration message is shown
        } else if ($scope.rconfirmPassword != $scope.rpassword) {
            document.getElementById('login_umessage').style.display = 'none';
            document.getElementById('register_smessage').style.display = 'none';
            document.getElementById('register_umessage').style.display = 'none';
            document.getElementById('register_umessage1').style.display = 'none';
            document.getElementById('register_umessage2').style.display = 'block';
            document.getElementById('register_umessage3').style.display = 'none';

            // the registration is successful and the corresponding successful registration message is shown
        } else {
            $http.post('/register', newuser).success(function(response) {
                if (response.res == 1) {
					document.getElementById('register_umessage').style.display = 'none';
                    document.getElementById('register_umessage1').style.display = 'none';
                    document.getElementById('register_umessage2').style.display = 'none';
                    document.getElementById('register_umessage3').style.display = 'none';
                    document.getElementById('login_umessage').style.display = 'none';
                    document.getElementById('register_smessage').style.display = 'block';
					
                } else {
                    //If the username already exists, the corresponding unsuccessful registration message is shown
                    document.getElementById('login_umessage').style.display = 'none';
                    document.getElementById('register_smessage').style.display = 'none';
                    document.getElementById('register_umessage').style.display = 'none';
                    document.getElementById('register_umessage1').style.display = 'none';
                    document.getElementById('register_umessage2').style.display = 'none';
                    document.getElementById('register_umessage3').style.display = 'block';	

                }
            });
        }

    }

    //when the user logs out, the page is reloaded
    $scope.logout = function() {
        location.reload();
    }

    // the function is executed when the Select Scenario Variable button is pressed
    $scope.select_scenario = function() {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('home').style.display = 'none';
        document.getElementById('wrapper').style.display = 'inline';
        // the list of inputs that can be selected as scenario variables is displayed
        document.getElementById('scenario_box').style.display = 'inline';
    }

    // the function is executed when the "Log in as guest" button is pressed
    $scope.guest = function() {
        applyScenario();
        document.getElementById('input_table_section').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        document.getElementById('home').style.display = 'inline';
        document.getElementById('wrapper').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';
        document.getElementById('login_box').style.display = 'none';
        document.getElementById('register_box').style.display = 'none';
        document.getElementById('login_umessage').style.display = 'none';
        document.getElementById('register_smessage').style.display = 'none';
        document.getElementById('register_umessage').style.display = 'none';
        document.getElementById('register_umessage1').style.display = 'none';
        document.getElementById('register_umessage2').style.display = 'none';
        document.getElementById('register_umessage3').style.display = 'none';
		
        // the username takes the Guest value in order to be seen in the "Log out" button
        $scope.username = "Guest";
        // the load and save button are disabled for the guest
        document.getElementById('load_button').style.backgroundColor = "#DCDCDC";
        document.getElementById('load_button').style.color = "white";
        document.getElementById('load_button').style.cursor = "not-allowed";
		document.getElementById("load_button").style.pointerEvents = "none";
        document.getElementById('save_button').style.backgroundColor = "#DCDCDC";
        document.getElementById('save_button').style.color = "white";
        document.getElementById('save_button').style.cursor = "not-allowed";
		document.getElementById("save_button").style.pointerEvents = "none";	

		 $http.post('/guest').success(function(response) {
			input_list.fixed.min_width_allowed = response.inputs.min_width_allowed;
            input_list.fixed.max_width_allowed = response.inputs.max_width_allowed;
            input_list.fixed.quay_length = response.inputs.quay_length;
            input_list.fixed.access_left = response.inputs.access_left;
            input_list.fixed.access_right = response.inputs.access_right;
            input_list.fixed.total_depth = response.inputs.total_depth;
            //fixed inputs are shown in the left sidebar
            $scope.min_width_allowed = input_list.fixed.min_width_allowed;
            $scope.max_width_allowed = input_list.fixed.max_width_allowed;
            $scope.quay_length = input_list.fixed.quay_length;
            $scope.access_left = input_list.fixed.access_left;
            $scope.access_right = input_list.fixed.access_right;
            $scope.total_depth = input_list.fixed.total_depth;
		});

    }

	/* Apply button from checkbox list (Select Scenario Variable button)*/
    function applyScenario() {
        document.getElementById('home').style.display = 'inline';
        document.getElementById('wrapper').style.display = 'inline';
        document.getElementById('scenario_box').style.display = 'none';

        // we save the value(true,false) of the checkedbox in the checkedBoxes JSON 
        checkedBoxes.scenario.transhipment = document.getElementById("checkbx.transhipment").checked;
        checkedBoxes.scenario.average_dwell = document.getElementById("checkbx.average_dwell").checked;
        checkedBoxes.scenario.peak_factor = document.getElementById("checkbx.peak_factor").checked;
        checkedBoxes.scenario.teu_factor = document.getElementById("checkbx.teu_factor").checked;
        checkedBoxes.scenario.number_qc = document.getElementById("checkbx.number_qc").checked;
        checkedBoxes.scenario.waterside_peak = document.getElementById("checkbx.waterside_peak").checked;
        checkedBoxes.scenario.landside_peak = document.getElementById("checkbx.landside_peak").checked;

        checkedBoxes.scenario.ref_widthm = document.getElementById("checkbx.ref_widthm").checked;
        checkedBoxes.scenario.ref_widthb = document.getElementById("checkbx.ref_widthb").checked;
        checkedBoxes.scenario.capacity_ws = document.getElementById("checkbx.capacity_ws").checked;
        checkedBoxes.scenario.capacity_ls = document.getElementById("checkbx.capacity_ls").checked;
        checkedBoxes.scenario.height = document.getElementById("checkbx.height").checked;
        checkedBoxes.scenario.max_occ = document.getElementById("checkbx.max_occ").checked;

        checkedBoxes.scenario.apron_depth = document.getElementById("checkbx.apron_depth").checked;
        checkedBoxes.scenario.landside_depth = document.getElementById("checkbx.landside_depth").checked;

        // The scenario table always contains the name and desired capacity columns, so they are always true;
        checkedBoxes.scenario.name = true;
        checkedBoxes.scenario.desiredcapacity = true;
        // stores in the checkedScenario the names of the inputs that where selected as scenario variables 
        checkedScenario = [];
        for (key in checkedBoxes.scenario) {
            if (checkedBoxes.scenario[key] == true) {
                checkedScenario.push({
                    "name": tableHeaderNames[key]
                });
				input_list.fixed[key]=undefined;
            }
            // if the corresponding value of the input that is contained in the checkedBoxes is false, then we delete the previous value from the scenario table.
            if (checkedBoxes.scenario[key] == false) {
                for (var row = 1; row <= numberOfScenarioRows; row++) {
                    $scope.newObject[row][scenarioVariablesNames[key]] = undefined;
                }
            }
        }
        //we assign to the variables used in index the variables build in the controller
        $scope.checkedSc = checkedScenario;
        sidebar_scenario();
    }
    //is called when the apply button from the select scenario is pressed
    $scope.apply_scenario = function() {
        applyScenario();
    };

    //this function is executed when the Load Input States submenu is chosen
    $scope.Load = function() {
            // all the elements with the li tag from the list are stored in lis array
            var lis = document.getElementById("wrapper2").getElementsByTagName('li');
            //we attach EventListener on each element of the list
            for (var i = 0; i < lis.length; i++) {
                lis[i].addEventListener('click', sendConfigName, false);
            }
            document.getElementById('wrapper2').style.cursor = "pointer";
            document.getElementById("wrapper2").style.pointerEvents = "auto";
    }
	
	// this function is executed when an element from the load list is clicked
    function sendConfigName() {
        // configname is stored
        var configName = {
            "name": this.innerHTML,
			"username":user.username
        };
        $http.post('/load', configName).success(function(response) {
            if (response != '') {
                // the received information is transformed in a JSON
                var loaded = JSON.parse(response[0].config);
                updateInputs(loaded);
            }
        });
        // click on the elements from the load list is not allowed
        document.getElementById('wrapper2').style.cursor = "not-allowed";
        document.getElementById("wrapper2").style.pointerEvents = "none";
		$scope.JSONoutputs=undefined;
		$scope.chartButtonVisibility="hidden";
		$scope.selectRowVisibility="hidden";
    }

	// this function is executed at each load
    function updateInputs(loaded) {
        input_list = loaded;
		// the values from the loaded configuration are transmitted to the left sidebar
        $scope.transhipment = input_list.fixed.transhipment;
        $scope.average_dwell = input_list.fixed.average_dwell;
        $scope.peak_factor = input_list.fixed.peak_factor;
        $scope.teu_factor = input_list.fixed.teu_factor;
        $scope.number_qc = input_list.fixed.number_qc;
        $scope.waterside_peak = input_list.fixed.waterside_peak;
        $scope.landside_peak = input_list.fixed.landside_peak;
        $scope.ref_widthm = input_list.fixed.ref_widthm;
        $scope.ref_widthb = input_list.fixed.ref_widthb;
        $scope.capacity_ws = input_list.fixed.capacity_ws;
        $scope.capacity_ls = input_list.fixed.capacity_ls;
        $scope.height = input_list.fixed.height;
        $scope.max_occ = input_list.fixed.max_occ;
        $scope.apron_depth = input_list.fixed.apron_depth;
        $scope.landside_depth = input_list.fixed.landside_depth;
		$scope.min_width_allowed = input_list.fixed.min_width_allowed;
        $scope.max_width_allowed = input_list.fixed.max_width_allowed;
        $scope.quay_length = input_list.fixed.quay_length;
        $scope.access_left = input_list.fixed.access_left;
        $scope.access_right = input_list.fixed.access_right;
        $scope.total_depth = input_list.fixed.total_depth;
		
        //sets the checkboxes from select scenario variable to false
		for(key in scenarioVariablesNames){
			document.getElementById("checkbx."+key).checked=false;
			checkedBoxes.scenario[key]=false;
		}
        
		checkedScenario = [{
            "name": "Configuration Name"
        }, {
            "name": "Desired Capacity"
        }];
		//  the scenario table is reconstructed according to the loaded information
        for (key in input_list.fixed) {
            if ((input_list.fixed[key] == undefined) || (input_list.fixed[key] == "")) {
				$scope[key]="scenario";
				//checks the scenario variables if there are some in the loaded data
				document.getElementById("checkbx."+key).checked=true;
				checkedBoxes.scenario[key]=true;
                checkedScenario.push({
                    "name": tableHeaderNames[key]
                });
            }
        }
        //we assign to the variables used in index the variables built in the controller
        $scope.checkedSc = checkedScenario;

        // rows are added to the scenario table according to how many rows are in the loaded configuration
        for (var i = numberOfScenarioRows; i < input_list.scenario.length; i++) {
            numberOfScenarioRows++;
            $scope.rows.push({
                "rowNumber": numberOfScenarioRows
            });
            $scope.newObject[numberOfScenarioRows] = {
                "row": numberOfScenarioRows
            };
        }
        // rows are removed from the scenario table according to how many rows are in the loaded configuration
        for (var i = numberOfScenarioRows; i > input_list.scenario.length; i--) {
            document.getElementById("scenario-table").deleteRow(numberOfScenarioRows);
            $scope.rows.splice(numberOfScenarioRows - 1, 1);
            delete $scope.newObject[numberOfScenarioRows];
            numberOfScenarioRows--;
        }
        // the values received from the loaded configuration are inserted in the scenario table
        for (var i = 0; i < input_list.scenario.length; i++) {
            $scope.newObject[i + 1]["Configuration Name"] = input_list.scenario[i].name;
            $scope.newObject[i + 1]["Desired Capacity"] = input_list.scenario[i].desired_cap;
            $scope.newObject[i + 1]["Transhipment (%)"] = input_list.scenario[i].transhipment;
            $scope.newObject[i + 1]["Average dwell(days):"] = input_list.scenario[i].average_dwell;
            $scope.newObject[i + 1]["Peak factor:"] = input_list.scenario[i].peak_factor;
            $scope.newObject[i + 1]["TEU factor:"] = input_list.scenario[i].teu_factor;
            $scope.newObject[i + 1]["Number of QC:"] = input_list.scenario[i].number_qc;
            $scope.newObject[i + 1]["Waterside peak:"] = input_list.scenario[i].waterside_peak;
            $scope.newObject[i + 1]["Landside peak:"] = input_list.scenario[i].landside_peak;
            $scope.newObject[i + 1]["Reference width (m)"] = input_list.scenario[i].ref_widthm;
            $scope.newObject[i + 1]["Reference width (bx):"] = input_list.scenario[i].ref_widthb;
            $scope.newObject[i + 1]["Capacity WS per mod:"] = input_list.scenario[i].capacity_ws;
            $scope.newObject[i + 1]["Capacity LS per mod (net bx/h):"] = input_list.scenario[i].capacity_ls;
            $scope.newObject[i + 1]["Height:"] = input_list.scenario[i].height;
            $scope.newObject[i + 1]["Max occ:"] = input_list.scenario[i].max_occ;
            $scope.newObject[i + 1]["Apron depth:"] = input_list.scenario[i].apron_depth;
            $scope.newObject[i + 1]["Landside depth:"] = input_list.scenario[i].landside_depth;
        }
    }
    // the SaveBox is displayed
	$scope.showSave = function() {
        $scope.saveText = "block";
		$scope.saveName="";
    }

    //this function is executed when the Save Input States submenu is chosen
    $scope.Save = function() {
		if(($scope.saveName!="") && ($scope.saveName!=undefined)){
            //the configuration name given in the SaveBox is stored in the input_list.name
			input_list.username=user.username;
            input_list.name = $scope.saveName;
            $http.post('/save', input_list).success(function(response) {
                // if the given name was not used previously the save is successful
                if (response.exists == false) {
                    $scope.loads = response.savedConfigs; // update the list
                    $scope.saveText = "none";    
                } else { //if the given name was previously used and exists in the saved configuration you are asked if you want to overwrite the config
					overwrite=confirm("Do you want to overwrite this config?");
					if(overwrite) $http.post('/overwrite', input_list).success(function(response) {
						if(response.value) {
							$scope.saveText = "none";
							document.getElementById("overwriteMessage").style.display = "block";
							setTimeout(function(){ document.getElementById("overwriteMessage").style.display = "none";},2000)
						}
					});
                }
            });
       }else{
		   alert("Please insert a name for the config!");
	   }
	}
       
    
	
	//generate the chart
	$scope.generateChart = function(){
		//checks if a popup window is already opened
		if(myWindow!=undefined) myWindow.close();
		//needed to count the checks on the input table
		var checkedInput=0;
		//needed to count the checks on the output table
		var checkedOutput=0;
		//counts how many configurations are checked for the chart generation
		for(var i=1;i<=numberOfScenarioRows;i++){
			if(document.getElementById("chartCheckBox."+i).checked==true){
				checkedInput++;
			}
		}
		//counts how many configurations are checked for the chart generation from the output table
		for(var i=0;i<$scope.JSONoutputs.length;i++){
			if(document.getElementById("tableRow."+i).checked==true){
				checkedOutput++;
			}
		}
		
		if(checkedInput==1){
			for(var row=1;row<=numberOfScenarioRows;row++){
				if(document.getElementById("chartCheckBox."+row).checked==true){ 
					//a popup is generated
					myWindow = window.open("", "Chart", "width=1000, height=550");
					//we write the desired information in the new window
					myWindow.document.write('<html><body><script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script><script src="Scripts/chart.js"></script></body></html>');   // Text in the new window
					var data=[];
					
					//the necessary information for the chart generation is added to the data
					var width=input_list.fixed.min_width_allowed;
					for(var i=(row-1)*(input_list.fixed.max_width_allowed - input_list.fixed.min_width_allowed+1);i<row*((input_list.fixed.max_width_allowed - input_list.fixed.min_width_allowed)+1);i++){
						data.push({"Configuration":""+$scope.JSONoutputs[i].maxModules+" mod X "+width+" w","Storage Capacity":""+$scope.JSONoutputs[i].storageCapacity,"Waterside Capacity ":""+$scope.JSONoutputs[i].CapacityWaterside,"Capacity Landside":""+$scope.JSONoutputs[i].CapacityLandside,"Capacity":""+$scope.JSONoutputs[i].Capacity});
						width+=1;				
					}
					//the variables is recognised in the popup window
					myWindow.chartData =data;
					myWindow.desiredcap2=input_list.scenario[row-1].desired_cap;	
					
					$scope.chartButtonVisibility="hidden";
					$scope.selectRowVisibility="hidden";
					document.getElementById("chartCheckBox."+row).checked=false;
				}
			}
		}else if(checkedInput>1){
			alert("Please check only one row from the input table!");
		}else if(checkedOutput>0){
			var checked=[];
			var data=[];
			for(var row=0;row<$scope.JSONoutputs.length;row++){
				if(document.getElementById("tableRow."+row).checked==true){
					checked.push({"position":row});
				}		
				//the necessary information for the chart generation is added to the data
				document.getElementById("tableRow."+row).checked=false;
			}
			desiredCapacityScenario=[];
			//the necessary information for the chart generation is added to the data and desiredcapacityScenario
			for(var i=0;i<checked.length;i++){
				data.push({"Configuration":""+$scope.JSONoutputs[checked[i].position].name+"-"+$scope.JSONoutputs[checked[i].position].width+" w","Storage Capacity":""+$scope.JSONoutputs[checked[i].position].storageCapacity,"Waterside Capacity ":""+$scope.JSONoutputs[checked[i].position].CapacityWaterside,"Capacity Landside":""+$scope.JSONoutputs[checked[i].position].CapacityLandside,"Capacity":""+$scope.JSONoutputs[checked[i].position].Capacity});			
				scenario = Math.trunc(checked[i].position / (input_list.fixed.max_width_allowed  - input_list.fixed.min_width_allowed + 1) ) ;
				desiredCapacityScenario.push({"desired":input_list.scenario[scenario].desired_cap});
			}
			myWindow = window.open("", "Chart", "width=1000, height=550");
			myWindow.desiredcap2=undefined;
			//we write the desired information in the new window
			myWindow.document.write('<html><body><script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script><script src="Scripts/chart.js"></script></body></html>');   // Text in the new window

			myWindow.desiredcap=desiredCapacityScenario;
			//the data variable is recognised in the whole browser
			myWindow.chartData =data;

			$scope.chartButtonVisibility="hidden";
			$scope.selectRowVisibility="hidden";

		}
	}
	//export CSV
	$scope.exportCSV = function(){
		//fields from csv
		var A = [['Configuration','Storage Capacity','Waterside Capacity','Capacity Landside','Capacity']];
		// add the data from table 
		for(var i=0; i<$scope.JSONoutputs.length; ++i){ 
			A.push([$scope.JSONoutputs[i].name, $scope.JSONoutputs[i].storageCapacity, $scope.JSONoutputs[i].CapacityWaterside,$scope.JSONoutputs[i].CapacityLandside,$scope.JSONoutputs[i].Capacity]);
		}

		var csvRows = [];
		// puts comma between each element
		for(var i=0, l=A.length; i<l; ++i){
			csvRows.push(A[i].join(','));
		}
		// create the file 
		var csvString = csvRows.join("%0A");
		var a         = document.createElement('a');
		a.href        = 'data:attachment/csv,' + csvString;
		a.target      = '_blank';
		a.download    = 'configuration.csv';
		// start the download
		document.body.appendChild(a);
		a.click();
	}			

	function checkTable(){
		var valid=true;
		var x =document.getElementsByName("scenarioRow");
		// make border default for each input
		for(var i =0;i<checkedScenario.length;i++){
			for(var j=1;j<=$scope.rows.length;j++){
				x[((j-1)*checkedScenario.length)+i].style.border="";
			}
		}
		for(var i =0;i<checkedScenario.length;i++){
			for(var j=1;j<=$scope.rows.length;j++){
				//check if the field is filled
				if(($scope.newObject[j][checkedScenario[i].name] == undefined) || ($scope.newObject[j][checkedScenario[i].name] == "")){
					valid=false;
					x[((j-1)*checkedScenario.length)+i].style.border="1px solid red";				
				}
				
				if(i!=0){
					//check if the input is >0.0001 and if is number
					if(($scope.newObject[j][checkedScenario[i].name]<0.0001) || (isNaN($scope.newObject[j][checkedScenario[i].name]))) {
						valid=false;
						x[((j-1)*checkedScenario.length)+i].style.border="1px solid red";
					}
				}else{
					//check if the input is string
					if(!isNaN($scope.newObject[j][checkedScenario[i].name])) {
						valid=false;
						x[((j-1)*checkedScenario.length)+i].style.border="1px solid red";
					}
				}
							
			}
		}
		return valid;
	}

    //table generation
    $scope.generateTable = function() {
		if(checkTable()){
			$scope.chartButtonVisibility="display";
			 $scope.selectRowVisibility="display";
			//the scenario is cleared
			input_list.scenario = [];
			for (var i = 0; i < $scope.rows.length; i++) {
					// add new element to scenario
					input_list.scenario.push({
						"name": undefined,
						"transhipment": undefined,
						"average_dwell": undefined,
						"peak_factor": undefined,
						"teu_factor": undefined,
						"desired_cap": undefined,
						"number_qc": undefined,
						"waterside_peak": undefined,
						"landside_peak": undefined,
						"ref_widthm": undefined,
						"ref_widthb": undefined,
						"capacity_ws": undefined,
						"capacity_ls": undefined,
						"height": undefined,
						"max_occ": undefined,
						"apron_depth": undefined,
						"landside_depth": undefined
					});
					//the values from scenario table are stored in the input_list
					input_list.scenario[i].name = $scope.newObject[i + 1]["Configuration Name"];
					input_list.scenario[i].desired_cap = $scope.newObject[i + 1]["Desired Capacity"];
					input_list.scenario[i].transhipment = $scope.newObject[i + 1]["Transhipment (%)"];
					input_list.scenario[i].average_dwell = $scope.newObject[i + 1]["Average dwell(days):"];
					input_list.scenario[i].peak_factor = $scope.newObject[i + 1]["Peak factor:"];
					input_list.scenario[i].teu_factor = $scope.newObject[i + 1]["TEU factor:"];
					input_list.scenario[i].number_qc = $scope.newObject[i + 1]["Number of QC:"];
					input_list.scenario[i].waterside_peak = $scope.newObject[i + 1]["Waterside peak:"];
					input_list.scenario[i].landside_peak = $scope.newObject[i + 1]["Landside peak:"];
					input_list.scenario[i].ref_widthm = $scope.newObject[i + 1]["Reference width (m)"];
					input_list.scenario[i].ref_widthb = $scope.newObject[i + 1]["Reference width (bx):"];
					input_list.scenario[i].capacity_ws = $scope.newObject[i + 1]["Capacity WS per mod:"];
					input_list.scenario[i].capacity_ls = $scope.newObject[i + 1]["Capacity LS per mod (net bx/h):"];
					input_list.scenario[i].height = $scope.newObject[i + 1]["Height:"];
					input_list.scenario[i].max_occ = $scope.newObject[i + 1]["Max occ:"];
					input_list.scenario[i].apron_depth = $scope.newObject[i + 1]["Apron depth:"];
					input_list.scenario[i].landside_depth = $scope.newObject[i + 1]["Landside depth:"];

			}
			$http.post('/calculate', input_list).success(function(response) {
				//in this array we store the result capacities higher than the desired capacity and it's position
				var resultCapacity = [];
				// stores the response in order to create the output table
				$scope.JSONoutputs = [];
				//needed to store the row position from the table
				var position =0;
				// based on the response from the server, we create the JSON which will populate the output table
				for (var i = 0; i < response.length; i++) {
					for (var j = 0; j <= input_list.fixed.max_width_allowed - input_list.fixed.min_width_allowed; j++) {
						$scope.JSONoutputs.push(response[i].config[j]);
						//checks if the result capacity is higher than the desired capacity and stores it 
						if(response[i].config[j].Capacity>=input_list.scenario[i].desired_cap) {
							resultCapacity.push({"position":position ,"result":response[i].config[j].Capacity});
						}
						position++;
					}
				}
				//gives every row an ID
				for(var i =0;i<$scope.JSONoutputs.length;i++){
					$scope.JSONoutputs[i].id=i;
				}
				//colors the value of the capacity which is higher then desired capacity
				setTimeout(function(){
					for( var i=0; i <resultCapacity.length;i++){
						document.getElementById("CapacityRow."+resultCapacity[i].position).style.color="red";
						if(resultCapacity[i].result==parseInt(document.getElementById("landsideCapacityRow."+resultCapacity[i].position).innerHTML)) document.getElementById("landsideCapacityRow."+resultCapacity[i].position).style.color="#FA8072";
						if(resultCapacity[i].result==parseInt(document.getElementById("watersideCapacityRow."+resultCapacity[i].position).innerHTML)) document.getElementById("watersideCapacityRow."+resultCapacity[i].position).style.color="#FA8072";
						if(resultCapacity[i].result==parseInt(document.getElementById("storageCapacityRow."+resultCapacity[i].position).innerHTML)) document.getElementById("storageCapacityRow."+resultCapacity[i].position).style.color="#FA8072";
					}
				}, 100);	
			});
		}
	}
}]);﻿