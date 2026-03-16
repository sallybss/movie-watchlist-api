function getTotal(items){
    let total = 0
    let unused = 10
    
    for(let i=0;i<items.length;i++){
    total = total + items[i]
    }
    
    if(items.length > 0){
    return total
    }else{
    return 0
    }
    }