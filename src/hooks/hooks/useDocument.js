import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";

export const useDocument = (collection,id) => {
    const [document, setDocument] = useState()
    const [error, setError] = useState()

    useEffect(() => {
        console.log('1')
        const ref = projectFirestore.collection(collection).doc(id)
        console.log(ref)
        ref.onSnapshot(snapshot => {
           if(snapshot.data()){
            setDocument({...snapshot.data(),id:snapshot.id})
            setError(null)
           }else{
            setError('không tồn tại')
           }    
    }
        ,(error) => {
            console.log(error.message)
            setError('Lấy dữ liệu thất bại')
        })
    },[collection,id])

    return { document,error }
}
