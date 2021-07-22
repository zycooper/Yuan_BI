function getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {

    //{} is for object [] is an array

    //result is the initial result
    //ret is the pivot title + hearder row which only has one more pivot title than newCols
    //after fill the data, ret will be the "final" result
    //item is a temp array
    var result = {},ret = [], newCols = [];
    
    for (var i = 0; i < dataArray.length; i++) {
       
        //clear result if it is not null
        if (!result[dataArray[i][rowIndex]]) 
        {
            result[dataArray[i][rowIndex]] = {};
        }

        var t=dataArray[i][dataIndex];
        result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];        
        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) === -1) {
            newCols.push(dataArray[i][colIndex]);
        }
    }
    newCols.sort(function(a, b){return a-b});
    var item = [];
    
    //Add Header Row
    item.push('Item');
    item.push('Total');
    item.push.apply(item, newCols);
    //ret now has the full header
    ret.push(item);

    //Add content
    for (var key in result) {
        item = [];
        item.push(key);
        //add Total number for each row
        var Sum=0;
        for (var j = 0; j < newCols.length; j++) { 
            if (!isNaN(parseInt(result[key][newCols[j]])))     
                Sum+= parseInt(result[key][newCols[j]]);           
        }
        item.push(Sum);

        for (var k = 0; k < newCols.length; k++) {
            item.push(result[key][newCols[k]] || "-");
        }       
        ret.push(item);
    }

    //Add total row
    item=[];  
   var temp_arr=ret.slice();
   temp_arr.shift();
    item=
    temp_arr.reduce(function (r, temp_arr) {      
        temp_arr.forEach(function (b, i) {                  
           if(!isNaN(parseInt(b))){             
            r[i] =(r[i]||0)+ parseInt(b);
            }
        });
        return r;
    }, []);
    item[0]='Total';
    ret.push(item);

    return ret;
}
function PivotTableHtml(myArray) {

    var result;
    for (var i = 0; i < myArray.length; i++) {
        result += "<tr>";
        for (var j = 0; j < myArray[i].length; j++) {
            result += "<td>" + myArray[i][j] + "</td>";
        }
        result += "</tr>";
    }
    result += "</table>";
    return result;
}    
function UpdateDTHtml(myArray) {
    var result="";
    for (var i = 0; i < myArray.length; i++) {       
        result += "<li class=\"list-group-item d-flex justify-content-between align-items-center\">"
            + myArray[i][0] + "<a href=\"#\" class=\"link\" onclick=\"SelectUpdateDT('" + myArray[i][0] +"')\" ><span class=\"badge badge-primary badge-pill\">"
            + myArray[i][1] + "</span></a></li>";
    }
    return result;
}
function AxisHtml(id,colArray)
{
    var result = "";
    for (var i = 0; i < colArray.length; i++) {
        result += "<a class=\"dropdown-item\" href=\"#\" onclick=\"SetDropName('"+id+"','" + colArray[i]+"')\">"
            + colArray[i] + "</a>";
    }
    return result;
}
function SetDropName(id, col_name) {
    if (id ==="x-axis-button") {
        x_axis_col = col_name;
    }
    if (id === "y-axis-button") {
        y_axis_col = col_name;
    }
    document.getElementById(id).innerHTML = col_name;

    if (x_axis_col !== null && y_axis_col !== null && x_axis_col !== "" && y_axis_col !== "" && typeof x_axis_col !== 'undefined' && typeof y_axis_col !== 'undefined') {        
        PopulatePivotData();
    }
}
function ChartHtml(myArray) {

    var ctx = document.getElementById('chart_div').getContext('2d');

    var labels_myArray = [];
    var data_myArray = [];

    for (var i = 0; i < myArray.length;i++)
    {
        labels_myArray.push(myArray[i][0]);
        data_myArray.push(myArray[i][1]);
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels_myArray,
            datasets: [{
                label:'Aging Records - No Filter',
                data: data_myArray,
                backgroundColor: ('rgb(0, 0, 255)')
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true                      
                    }
                }]
            }
        }});
}