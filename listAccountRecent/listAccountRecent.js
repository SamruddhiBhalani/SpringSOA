import { LightningElement, wire } from 'lwc';
import getAccountListRecent from '@salesforce/apex/AccountController.getAccountListRecent'
import getHttpCallout from '@salesforce/apex/AccountController.getHttpCallout'

export default class ListAccountRecent extends LightningElement {
    headings =["Id","Name","Type","Industry"]
    fullTables = []
    fileteredData = []
    timer
    filterBy = "Name"
    sortedBy = "Name"
    sortDirection = 'asc'
    @wire(getAccountListRecent)
    accountHandler({data, error}){
        if(data){
            this.fullTables = data
            this.fileteredData = [...this.sortBy(data)]
        }
        if(error){
            console.error(error)
        }
    }

    get FilterByOptions(){
        return[
            {label:'All', value:'All'},
            {label:'Id', value:'Id'},
            {label:'Name', value:'Name'},
            {label:'Type', value:'Type'},
            {label:'Industry', value:'Industry'}
        ]
    }

    get SortByOptions(){
        return[
            {label:'Id', value:'Id'},
            {label:'Name', value:'Name'},
            {label:'Type', value:'Type'},
            {label:'Industry', value:'Industry'}
        ]
    }

    filterByHandler(event){
        this.filterBy = event.target.value
    }

    filterHandler(event){
        const {value} = event.target
        window.clearTimeout(this.timer)
        if(value){ 
            this.timer = window.setTimeout(()=>{
                console.log(value)
                this.fileteredData = this.fullTables.filter(eachObj=>{
                    if(this.filterBy === 'All'){
                        return Object.keys(eachObj).some(key=>{
                        return eachObj[key].toLowerCase().includes(value)
                    })
                    }else{
                        const val = eachObj[this.filterBy] ? eachObj[this.filterBy]: ''
                        return val.toLowerCase().includes(value)
                    }

                    
                    /* below logic will filter each every proprty of object*/
                    //return Object.keys(eachObj).some(key=>{
                    //    return eachObj[key].toLowerCase().includes(value)
                    //})
                })
            }, 500)
            
        } else{
            this.fileteredData = [...this.fullTables]
        }
        
    }

    /*Sorting Logiv here */
    sortByHandler(event){
         this.sortedBy = event.target.value
         this.fileteredData = [...this.sortBy(this.fileteredData)]

    }

    sortBy(data){
        const cloneData = [...data]
        cloneData.sort((a,b)=>{
            if(a[this.sortedBy] === b[this.sortedBy]){
                return 0
            }
            return this.sortDirection === 'desc' ? 
            a[this.sortedBy] > b[this.sortedBy] ? -1:1 :
            a[this.sortedBy] < b[this.sortedBy] ? -1:1
        })
        return cloneData
    }

    httpHandler(){
        getHttpCallout()
    }
}