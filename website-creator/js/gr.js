
var credentials;
var secretKey;
var accessKey;
var sessionId;
var connect;
var selectedId, selectedTDGName;
var selectedPhoneId, selectedPhoneNumber;
var tdgList, phoneList;
var dlgSourceAccessKey, dlgSourceSecretKey, dlgSourceRegion, dlgInstanceId;
const GCREATE = 'CREATE';
const GMODIFY = 'MODIFY';
const GVOICE = 'VOICE';
const GCHAT = 'CHAT';
const GSTANDARD = 'STANDARD';
var GDELETE ='';
const DELETEINSTANCE = 'INSTANCE';
const DELETETDG = 'TDG';

// allowed will be CREATE and MODIFY
var currentOperation = GCREATE;

$( document ).ready(function() {
    /*if (!checkCookie()) {
        setAWSConfig(dlgSourceAccessKey, dlgSourceSecretKey, dlgSourceRegion);
        setupAll();
    } else {
        setupAll();
        $( "#configDialog" ).dialog( "open" );
    }*/
    	setupAll();
        $( "#configDialog" ).dialog( "open" );

});

function setupAll() {
    //loadConnectAPIs();

        
    $("#listTDG").click(() => {
        getListTrafficDistributionGroups();
    });

    $("#listPhoneNumbers").click(() => {
        getAllPhoneNumbers();
    });

    $("#listPhoneNumbersTDG").click(() => {
        getAllPhoneNumbersByTDG();
    });

    $("#claimPhoneNumber").click(() => {
        $( "#phClaimDialog" ).dialog( "open" );
        $('#sltPhoneNumbersToClaim').empty();
    });

    $("#describePhoneNumber").click(() => {
        getPhoneNumberInfo(selectedPhoneId);
    });

    $("#btnSearchAvailableNumber").click(() => {
        getClaimablePhoneNumbers();
    });
    
    $("#btnClaim").click(() => {
        claimableThePhoneNumber();
    });
    
    $("#btnClaimAndAssociate").click(() => {
        claimablePhoneNumberAndAssociate();
    });
    
    $("#releasePhoneNumber").click(() => {
        releaseSelectedPhoneNumber();
    });
    
    $("#createTDG").click(() => {
        currentOperation=GCREATE;
        clear_form_elements('#frmTDGCreate');
        $( "#dlgTDG" ).dialog( "open" );
    });

    $("#btnCreateTDG").click(() => {
        createTDG();
        $( "#dlgTDG" ).dialog( "close" );
    });
    
    $("#replicateInstance").click(() => {
        clear_form_elements('#frmReplica');
        $( "#dlgInstanceReplica" ).dialog( "open" );
    });
    
    $("#btnCreateInstanceReplica").click(() => {
        createReplicateInstance();
    });

    $("#describeTDG").click(() => {
        describeTDG(selectedId);
    });

    $("#getTDG").click(() => {
        clear_form_elements('#frmTDGModify');
        $( "#dlgTDGModify" ).dialog( "open" );
        getTDG(selectedId);
    });

    $("#btnModifyTDG").click(() => {
        modifyTDG();
    });
    
    
    $("#btnRename").click(() => {
        renameQC(selectedId);
    });
    
        
    $("#deleteTDG").click(() => {
		GDELETE = DELETETDG;
        $( "#confirmDialog" ).dialog( "open" );
    });

    $("#deleteInstance").click(() => {
		GDELETE = DELETEINSTANCE;
        $( "#confirmDialog" ).dialog( "open" );
    });


    $("#updatePhoneNumber").click(() => {
		$("#txtInstanceARN").val(dlgInstanceId);
        $( "#dlgUpdatePhoneNumber" ).dialog( "open" );
    });

    $("#btnUpdatePhoneNumber2Instance").click(() => {
        updatePhoneNumberDetails(1);
    });

    $("#btnUpdatePhoneNumber2TDG").click(() => {
        updatePhoneNumberDetails(2);
    });
    
 	$("#dlgUpdatePhoneNumber").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });

	$("#phAssociateCFDialog").dialog({
        autoOpen: false,
        width: 400,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });

    $("#associatePhoneNumberContactFlow").click(() => {
        $( "#phAssociateCFDialog" ).dialog( "open" );
    });

	$("#btnAssociateCF").click(() => {
        associateContactFlowForNumber();
    });
    
    $("#disAssociatePhoneNumberContactFlow").click(() => {
        disAssociatePhoneNumberContactFlow();
    });
    
    
    $("#awsConfiguration").click(() => {
        $( "#configDialog" ).dialog( "open" );
    });
    
    $("#btnPrefillConfiguration").click(() => {
        btnPrefillConfiguration();
    });
    
    
    $("#btnConfiguration").click(() => {
        if (saveCookie()) {
			//setupAll();
			loadConnectAPIs();
            $( "#configDialog" ).dialog( "close" );
        } else {
            $( "#configDialog" ).dialog( "open" );
        }
    });
       
    $("#dialog").dialog({
        autoOpen: false,
        modal: true
      });
    
    $("#dlgTDG").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });

    $("#phClaimDialog").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });

   
    $("#dlgTDGModify").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });

    
    $("#dlgInstanceReplica").dialog({
        autoOpen: false,
        width: 800,
        modal: true,
        resizable: false,
        height: "auto"        
        
    });
    
    $("#resultDialog").dialog({
        autoOpen: false,
        modal: true
    });

    
    $('#configDialog').dialog({
        autoOpen: false,
        width: 850,
        modal: true,
        resizable: false,
        height: "auto"        
    });

    
    $( "#confirmDialog" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Yes": function() {
            $( this ).dialog( "close" );
            if(GDELETE === DELETETDG) {
				deleteTDG(selectedId);
			} else {
				deleteInstance(dlgInstanceId);
			}
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        }
    });        
    
    qcListTable = $('#qcListTable').DataTable({
        columnDefs: [
            {
                targets: -1,
                className: 'dt-body-right'
            }
          ],        
        columns: [{title: "Name"},{title: "Status"}],
        select: true,
        paging: false,
        info: false,
        searching: false
    });
    
    qcListTable.on( 'select', function ( e, dt, type, indexes ) {
        if ( type === 'row' ) {
            selectedTDGName = qcListTable.rows( indexes ).data()[0][0];
            $('#selectedTDG').val(selectedTDGName);
            for (var i=0; i< tdgList.TrafficDistributionGroupSummaryList.length; i++) {
                if (selectedTDGName === tdgList.TrafficDistributionGroupSummaryList[i].Name) {
                    selectedId = tdgList.TrafficDistributionGroupSummaryList[i].Arn;
                    break;
                }
            }
        }
    });
    
	phListTable = $('#phListTable').DataTable({
        columnDefs: [
            {
                targets: -1,
                className: 'dt-body-right'
            }
          ],        
        columns: [{title: "Phone Number"},{title: "Type"}, {title: "Country"}],
        select: true,
        paging: false,
        info: false,
        searching: false
    });
     
    phListTable.on( 'select', function ( e, dt, type, indexes ) {
        if ( type === 'row' ) {
            selectedPhoneNumber = phListTable.rows( indexes ).data()[0][0];
            $('#selectedPhoneNumber').val(selectedPhoneNumber);
            for (var i=0; i< phoneList.ListPhoneNumbersSummaryList.length; i++) {
                if (selectedPhoneNumber === phoneList.ListPhoneNumbersSummaryList[i].PhoneNumber) {
                    selectedPhoneId = phoneList.ListPhoneNumbersSummaryList[i].PhoneNumberArn;
                    break;
                }
            }
        }
    });
    //getAllPhoneNumbers();    
    //getListTrafficDistributionGroups();
}

async function updatePhoneNumberDetails(option) {
    try {
        handleWindow(true, '');
        var sa;
        if(option === 1) {
        	sa = await  updatePhoneNumber (selectedPhoneId, dlgInstanceId);
		} else {
        	sa = await  updatePhoneNumber (selectedPhoneId, $('#sltTDGs').val());
		}
        console.log(sa);
        handleWindow(false, '');
        showResults("Successfully updated phone number");
        getAllPhoneNumbers();    
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function disAssociatePhoneNumberContactFlow() {
    try {
        handleWindow(true, '');
        let sa = await  disassociatePhoneNumberContactFlow (selectedPhoneId, dlgInstanceId);
        console.log(sa);
        handleWindow(false, '');
        showResults("Successfully disassociated flow from the selected number");
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function associateContactFlowForNumber() {
    try {
        handleWindow(true, '');
        var contactFlowId =  $('#sltContactFlowToAssociate').val();
        let sa = await associatePhoneNumberContactFlow(selectedPhoneId, dlgInstanceId, contactFlowId);
        console.log(sa);
        $( "#phAssociateCFDialog" ).dialog( "close" );
        handleWindow(false, '');
        showResults("Successfully associated flow to the selected number");
        
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}
async function releaseSelectedPhoneNumber() {
    try {
        handleWindow(true, '');
        var resp = await releasePhoneNumber(selectedPhoneId);
        console.log(resp);
        getAllPhoneNumbers();
        handleWindow(false, '');
        showResults("Successfully released the selected number from your instance");
        
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function claimablePhoneNumberAndAssociate() {
    try {
        handleWindow(true, '');
        var phoneNumber = $('#sltPhoneNumbersToClaim').val();
        var phoneNumberDescription = $('#txtDescription').val();
		var contactFlowId = $('#sltContactFlowToAssociate').val();
        var resp = await claimPhoneNumber(dlgInstanceId, phoneNumber, phoneNumberDescription);
        console.log(resp);
        resp = associatePhoneNumberContactFlow(resp.PhoneNumberId, dlgInstanceId, contactFlowId);
        getAllPhoneNumbers();
        handleWindow(false, '');
        $( "#phClaimDialog" ).dialog( "close" );
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function claimableThePhoneNumber() {
    try {
        handleWindow(true, '');
        var phoneNumber = $('#sltPhoneNumbersToClaim').val();
        var phoneNumberDescription = $('#txtDescription').val();
        var resp, tdg;
        tdg =  $('#sltTDG').val();
	    if(tdg != '-') {
        	resp = await claimPhoneNumber(tdg, phoneNumber, phoneNumberDescription);
		
		} else {
        	resp = await claimPhoneNumber(dlgInstanceId, phoneNumber, phoneNumberDescription);
			
		}
        console.log(resp);
        getAllPhoneNumbers();
        handleWindow(false, '');
        $( "#phClaimDialog" ).dialog( "close" );
        
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function getClaimablePhoneNumbers() {
    try {
        handleWindow(true, '');
        var phoneNumberCountryCode = $('#sltCountry').val();
        var phoneNumberType = $('#sltPhoneNumberType').val();
        let sa = await searchAvailablePhoneNumbers(dlgInstanceId, phoneNumberCountryCode, phoneNumberType, null, 10, null);
        console.log(sa);
        formatJSON(sa, '#rpFormatted');
		$('#sltPhoneNumbersToClaim').empty();
	    for(var i=0; i < sa.AvailableNumbersList.length; i++){
	    	var j = sa.AvailableNumbersList[i];
   			$('#sltPhoneNumbersToClaim').append('<option selected value="' +  j.PhoneNumber + '">' + j.PhoneNumber +'</option>');
	    }        
		
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function getPhoneNumberInfo(phId) {
    try {
        handleWindow(true, '');
        var ph = await describePhoneNumber(phId);
        console.log(ph);
        formatJSON(ph, '#rpFormatted');
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function getAllPhoneNumbersByTDG() {
    try {
        handleWindow(true, '');
        var phCountryCode = ["US", "AU", "FR"];
        var phNumberTypes = ["TOLL_FREE", "DID"];
        
        phoneList = await listPhoneNumbersV2(selectedId, 1000, null, phCountryCode, phNumberTypes, null);
        console.log(phoneList);
        formatJSON(phoneList, '#rpFormatted');
        phListTable.clear();
        for (var i=0; i< phoneList.ListPhoneNumbersSummaryList.length; i++) {
            var value = phoneList.ListPhoneNumbersSummaryList[i];
           	phListTable.row.add([value.PhoneNumber, value.PhoneNumberType, value.PhoneNumberCountryCode ]);
        }
        phListTable.draw();

 		var cfList = await listContactFlows(dlgInstanceId);
        console.log(cfList);

		$('#sltContactFlowToAssociate').empty();
	    for(var i=0; i < cfList.ContactFlowSummaryList.length; i++){
	    	var j = cfList.ContactFlowSummaryList[i];
	    	if(j.ContactFlowType === "CONTACT_FLOW") {
	    			$('#sltContactFlowToAssociate').append('<option selected value="' +  j.Id + '">' + j.Name +'</option>');
	    	}
	    }       
        
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}

async function getAllPhoneNumbers() {
    try {
        handleWindow(true, '');
        var phCountryCode = ["US", "AU", "FR"];
        var phNumberTypes = ["TOLL_FREE", "DID"];
        phoneList = await listPhoneNumbersV2(dlgInstanceId, 1000, null, phCountryCode, phNumberTypes, null);
        console.log(phoneList);
        formatJSON(phoneList, '#rpFormatted');
        phListTable.clear();
        for (var i=0; i< phoneList.ListPhoneNumbersSummaryList.length; i++) {
            var value = phoneList.ListPhoneNumbersSummaryList[i];
           	phListTable.row.add([value.PhoneNumber, value.PhoneNumberType, value.PhoneNumberCountryCode ]);
        }
        phListTable.draw();

 		var cfList = await listContactFlows(dlgInstanceId);
        console.log(cfList);

		$('#sltContactFlowToAssociate').empty();
	    for(var i=0; i < cfList.ContactFlowSummaryList.length; i++){
	    	var j = cfList.ContactFlowSummaryList[i];
	    	if(j.ContactFlowType === "CONTACT_FLOW") {
	    			$('#sltContactFlowToAssociate').append('<option selected value="' +  j.Id + '">' + j.Name +'</option>');
	    	}
	    }       
        
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}


async function modifyTDG() {
    try {
        handleWindow(true, '');
        let config = {};
        //config["TelephonyConfig"] ={};
        //config["TelephonyConfig"]["Distribution"] =[];
        config["Distributions"] =[];
        let region1Details = {};
        let region2Details = {};
        region1Details["Region"] = $("#txtRegion1").val();
		region1Details["Percentage"] = $("#txtPercentage1").val();
        region2Details["Region"] = $("#txtRegion2").val();
		region2Details["Percentage"] = $("#txtPercentage2").val();
		config["Distributions"].push(region1Details);
	    config["Distributions"].push(region2Details);		                       
        let resp = await updateTrafficDistribution(selectedId, config);
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        handleWindow(false, '');
        $( "#dlgTDGModify" ).dialog( "close" );
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}

async function createReplicateInstance() {
    try {
        handleWindow(true, '');                
        let resp = await replicateInstance(dlgInstanceId, $('#txtReplicaName').val(), $('#txtReplicaRegion').val());
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        handleWindow(false, '');
        $( "#dlgInstanceReplica" ).dialog( "close" );
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}

async function createTDG() {
    try {
        handleWindow(true, '');                
        let resp = await createTrafficDistributionGroup(dlgInstanceId, $('#tdgName').val(), $('#tdgDescription').val());
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        getListTrafficDistributionGroups();
        handleWindow(false, '');
        $( "#dlgTDG" ).dialog( "close" );
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}

async function deleteTDG() {
    try {
        handleWindow(true, '');        
        let resp = await deleteTrafficDistributionGroup(selectedId);
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        getListTrafficDistributionGroups();
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}


async function describeTDG() {
    try {
        handleWindow(true, '');        
        let resp = await describeTrafficDistributionGroup(selectedId);
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}

async function getTDG() {
    try {
        handleWindow(true, '');        
        let resp = await getTrafficDistribution(selectedId);
        console.log(resp);
        formatJSON(resp, '#rpFormatted');
        
        $("#txtRegion1").val(resp.TelephonyConfig.Distributions[0].Region);
        $("#txtPercentage1").val(resp.TelephonyConfig.Distributions[0].Percentage);
        $("#txtRegion2").val(resp.TelephonyConfig.Distributions[1].Region);
        $("#txtPercentage2").val(resp.TelephonyConfig.Distributions[1].Percentage);
        
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
	
}

async function getListTrafficDistributionGroups() {
    try {
        handleWindow(true, '');
        tdgList = await listTrafficDistributionGroups(dlgInstanceId, null, 10);
        console.log(tdgList);

        formatJSON(tdgList, '#rpFormatted');
       /* var cfList = await listContactFlows(dlgInstanceId);
        console.log(cfList);

		$('#sltContactFlowToAssociate').empty();
	    for(var i=0; i < cfList.ContactFlowSummaryList.length; i++){
	    	var j = cfList.ContactFlowSummaryList[i];
	    	if(j.ContactFlowType === "CONTACT_FLOW") {
	    			$('#sltContactFlowToAssociate').append('<option selected value="' +  j.Id + '">' + j.Name +'</option>');
	    	}
	    }*/       
		
        qcListTable.clear();
        for (var i=0; i< tdgList.TrafficDistributionGroupSummaryList.length; i++) {
            var value = tdgList.TrafficDistributionGroupSummaryList[i];
            qcListTable.row.add([value.Name, value.Status]);
        }
        qcListTable.draw();
        
		$('#sltTDG').empty();
		$('#sltTDGs').empty();
		$('#sltTDG').append('<option selected value="-">-</option>');
	    for(var i=0; i < tdgList.TrafficDistributionGroupSummaryList.length; i++){
	    	var j = tdgList.TrafficDistributionGroupSummaryList[i];
   			$('#sltTDG').append('<option selected value="' +  j.Arn + '">' + j.Name +'</option>');
   			$('#sltTDGs').append('<option selected value="' +  j.Arn + '">' + j.Name +'</option>');
	    }       
        
        handleWindow(false, '');
    } catch(e) {
        console.log(e);        
        handleWindow(false, '');
        showResults(e);
    }
    
}


const updatePhoneNumber = (phoneNumberId, targetArn ) => {
    return new Promise((resolve,reject) => {
           var params = {PhoneNumberId : phoneNumberId, TargetArn : targetArn };       
           console.log(params);
           connect.updatePhoneNumber(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const updateTrafficDistribution = (id, telephonyConfig ) => {
    return new Promise((resolve,reject) => {
           var params = {Id : id, TelephonyConfig : telephonyConfig };       
           console.log(params);
           connect.updateTrafficDistribution(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const replicateInstance = (instanceId, replicaAlias, region ) => {
    return new Promise((resolve,reject) => {
           var params = {InstanceId : instanceId, ReplicaRegion : region, ReplicaAlias : replicaAlias  };       
           console.log(params);
           connect.replicateInstance(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const describeTrafficDistributionGroup = (trafficDistributionGroupId) => {
    return new Promise((resolve,reject) => {
           var params = {TrafficDistributionGroupId : trafficDistributionGroupId  };       
           console.log(params);
           connect.describeTrafficDistributionGroup(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }


const deleteTrafficDistributionGroup = (trafficDistributionGroupId) => {
    return new Promise((resolve,reject) => {
           var params = {TrafficDistributionGroupId : trafficDistributionGroupId  };       
           console.log(params);
           connect.deleteTrafficDistributionGroup(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const createTrafficDistributionGroup = (instanceId, name, description) => {
    return new Promise((resolve,reject) => {
           var params = {Name : name, Description: description, InstanceId : instanceId };       
           console.log(params);
           connect.createTrafficDistributionGroup(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const listTrafficDistributionGroups = (instanceId, nextToken, maxResults) => {
    return new Promise((resolve,reject) => {
           var params = {InstanceId : instanceId, NextToken : nextToken, MaxResults : maxResults };       
           console.log(params);
           connect.listTrafficDistributionGroups(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const getTrafficDistribution = (id) => {
    return new Promise((resolve,reject) => {
           var params = {Id : id};       
           console.log(params);
           connect.getTrafficDistribution(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }


const describeTrafficRouting = (voiceConfiguration) => {
    return new Promise((resolve,reject) => {
           var params = {VoiceConfiguration : voiceConfiguration};       
           console.log(params);
           connect.describeTrafficRouting(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const updateTrafficRouting = (failover, voiceConfiguration) => {
    return new Promise((resolve,reject) => {
           var params = {Failover : failover, VoiceConfiguration : voiceConfiguration};       
           console.log(params);
           connect.updateTrafficRouting(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const searchAvailablePhoneNumbers = (targetArn, phoneNumberCountryCode, phoneNumberType, phoneNumberPrefix, maxResults, nextToken ) => {
    return new Promise((resolve,reject) => {
           var params = {TargetArn : targetArn, PhoneNumberCountryCode : phoneNumberCountryCode,
           		PhoneNumberType : phoneNumberType, PhoneNumberPrefix : phoneNumberPrefix, MaxResults : maxResults,
           		NextToken : nextToken};       
           console.log(params);
           connect.searchAvailablePhoneNumbers(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const listPhoneNumbersV2 = (targetArn, maxResults, nextToken, phoneNumberCountryCodes, phoneNumberTypes, phoneNumberPrefix) => {
    return new Promise((resolve,reject) => {
           var params = {TargetArn : targetArn, MaxResults : maxResults, NextToken : nextToken, 
           				PhoneNumberCountryCodes : phoneNumberCountryCodes, PhoneNumberTypes : phoneNumberTypes,
           				PhoneNumberPrefix : phoneNumberPrefix};       
           console.log(params);
           connect.listPhoneNumbersV2(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const listPhoneNumbers = (instanceId ) => {
    return new Promise((resolve,reject) => {
           var params = {InstanceId : instanceId};       
           console.log(params);
           connect.listPhoneNumbers(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const describePhoneNumber = (phoneNumberId ) => {
    return new Promise((resolve,reject) => {
           var params = {PhoneNumberId : phoneNumberId};       
           console.log(params);
           connect.describePhoneNumber(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const listContactFlows = (instanceId) => {
    return new Promise((resolve,reject) => {
           var params = {InstanceId : instanceId};       
           console.log(params);
           connect.listContactFlows(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const claimPhoneNumber = (targetArn, phoneNumber, phoneNumberDescription) => {
    return new Promise((resolve,reject) => {
           var params = {TargetArn : targetArn, PhoneNumber : phoneNumber, PhoneNumberDescription : phoneNumberDescription};       
           console.log(params);
           connect.claimPhoneNumber(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const associatePhoneNumberContactFlow = (phoneNumberId, instanceId, contactFlowId) => {
    return new Promise((resolve,reject) => {
           var params = {PhoneNumberId : phoneNumberId, InstanceId : instanceId, ContactFlowId : contactFlowId};       
           console.log(params);
           connect.associatePhoneNumberContactFlow(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const releasePhoneNumber = (phoneNumberId) => {
    return new Promise((resolve,reject) => {
           var params = {PhoneNumberId : phoneNumberId};       
           console.log(params);
           connect.releasePhoneNumber(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const disassociatePhoneNumberContactFlow = (phoneNumberId, instanceId) => {
    return new Promise((resolve,reject) => {
           var params = {PhoneNumberId : phoneNumberId, InstanceId : instanceId};       
           console.log(params);
           connect.disassociatePhoneNumberContactFlow(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }

const deleteInstance = (instanceId) => {
    return new Promise((resolve,reject) => {
           var params = {InstanceId : instanceId};       
           console.log(params);
           connect.deleteInstance(params, function (err, res) {        
                if (err) 
                     reject(err);
                 else 
                    resolve(res);
            });
        });
    }
    
function showResults(message){
    $('#resultSpan').text(message);
    $("#resultDialog").dialog("open");
}

function loadConnectAPIs() {
	connect = new AWS.Connect({ region: dlgSourceRegion} ) ;
}

async function getIPJSON(){
    try{
    	let a = await makeAJAXGet('https://ip-ranges.amazonaws.com/ip-ranges.json');
    	console.log(a);
    	var ac = [];
    	var ec2 = [];
    	for(var i=0; i< a.prefixes.length; i++) {
    		var item = a.prefixes[i];
    		if(item.service === 'AMAZON_CONNECT'){
    			ac.push(item);	
    		}
    		if(item.service ===  'EC2_INSTANCE_CONNECT'){
    			ec2.push(item);
    		}
    	}
    	var f = {};
    	f.amazonconnect = ac;
    	f.ec2 = ec2;
    	formatJSON(f, '#rpFormatted');
    }catch(e){    	
    	console.log(e)
    }
	
}

const makeAJAXGet = (url) => {
    return new Promise((resolve,reject) => {
  	  var posting = $.ajax({
          url: url,
          method: "GET",
          dataType: 'json'
      })
      .done(function (msg) {
    	  resolve(msg);
      })
      .fail(function (msg) {
	   	   reject(msg);    	   
      });
    	
     });
}


function handleWindow(openClose, text) {
    if(openClose == true) {
        $( "#dialog" ).dialog( "open" );
    } else {
        $( "#dialog" ).dialog( "close" );
    }

    if(text.length>1) {
        $('#waitingSpan').text(text);
    } else {
        $('#waitingSpan').text('    Waiting for server to respond');
    }
}

function setAWSConfig(accessKey, secretKey, rgn) {

    AWS.config.update({
        accessKeyId: accessKey, secretAccessKey: secretKey, region: rgn
    });    
    AWS.config.credentials.get(function (err) {
        if (err)
            console.log(err);
        else {
            credentials = AWS.config.credentials;
            getSessionToken();
        }
    });
    
}

function formatJSON(data, element) {
    $(element).html(prettyPrintJson.toHtml(data));
}


function getSessionToken() {
    var sts = new AWS.STS();
    sts.getSessionToken(function (err, data) {
      if (err) console.log("Error getting credentials");
      else {
          secretKey = data.Credentials.SecretAccessKey;
          accessKey = data.Credentials.AccessKeyId;
          sessionId = data.Credentials.SessionToken;
      }
    });
}

function clear_form_elements(ele) {
    $(':input',ele)
      .not(':button, :submit, :reset')
      .val('')
      .prop('checked', false)
      .prop('selected', false);
}

function saveCookie() {
    dlgSourceAccessKey=$("#dlgSourceAccessKey").val();
    dlgSourceSecretKey=$("#dlgSourceSecretKey").val();
    dlgSourceRegion=$("#dlgSourceRegion").val();
    dlgInstanceId = $("#dlgInstanceId").val();
    
    if(!checkAllMandatoryFields()) {
        $('#spnAWSMessage').text('');
        setAWSConfig(dlgSourceAccessKey, dlgSourceSecretKey, dlgSourceRegion);
        return true;
    }else{
        $('#spnAWSMessage').text('All fields are mandatory and cannot be whitespaces or null');        
        return false;
    }
    
    /*if(!checkAllMandatoryFields()) {
        setCookie("dlgSourceAccessKey", dlgSourceAccessKey,100);
        setCookie("dlgSourceSecretKey", dlgSourceSecretKey,100 );
        setCookie("dlgSourceRegion", dlgSourceRegion,100);
        setCookie("dlgInstanceId", dlgInstanceId,100);
        $('#spnAWSMessage').text('');
        setAWSConfig(dlgSourceAccessKey, dlgSourceSecretKey, dlgSourceRegion);
        return true;
    }else{
        $('#spnAWSMessage').text('All fields are mandatory and cannot be whitespaces or null');        
        return false;
    }*/
}

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
      x=x.replace(/^\s+|\s+$/g,"");
      if (x===c_name)
        {
          return unescape(y);
        }
     }
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
    dlgSourceAccessKey=getCookie("dlgSourceAccessKey");
    dlgSourceSecretKey=getCookie("dlgSourceSecretKey");
    dlgSourceRegion=getCookie("dlgSourceRegion");
    dlgInstanceId=getCookie("dlgInstanceId");
    $('#dlgSourceAccessKey').val(dlgSourceAccessKey);
    $('#dlgSourceSecretKey').val(dlgSourceSecretKey);
    $('#dlgSourceRegion').val(dlgSourceRegion);
    $('#dlgInstanceId').val(dlgInstanceId);
    
    return checkAllMandatoryFields();
}

function checkAllMandatoryFields() {
    if(isBlank(dlgSourceAccessKey) || dlgSourceAccessKey.isEmpty() || 
            isBlank(dlgSourceSecretKey) || dlgSourceSecretKey.isEmpty() || 
            isBlank(dlgSourceRegion) || dlgSourceRegion.isEmpty() ||
            isBlank(dlgInstanceId) || dlgInstanceId.isEmpty()
            ) {
        return true;
    }else
        return false;
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
