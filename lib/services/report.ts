export async function  createNewReport(data:any) {
    console.log("data", data);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_REPORT_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if(response.status !== 201) {
            return false
        }
        if(response.status === 201) {
            return true
        }
    }catch(err) {
        return false
    }
}