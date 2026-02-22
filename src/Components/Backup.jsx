import {} from 'react'
import {} from 'react-router-dom'
export default function({data,setData}){
    function getFullState(){
        const json=JSON.stringify({
            version:1,
            createdAt:new Date().toISOString(),
            data:data
        },null,2)
        const blob=new Blob([json], { type: "application/json"  })
        return URL.createObjectURL(blob)
    }
    function downloadBackup(){
        const url=getFullState()
        const a = document.createElement("a")
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
    function handleFileChange(e){
        const file=e.target.files[0]
        if (!file) return
        const reader=new FileReader()
        reader.onload = function () {
            const text = reader.result;
            let flag2=0
            let fileData
            try{
                fileData=JSON.parse(text)
            }catch(err){
                alert('Incorrect format')
                flag2=1
                return
            }
            if(flag2){
                return
            }
            if(!fileData||!fileData.data||!fileData.version||!fileData.createdAt){
                alert('Incorrect format')
                return
            }
            else{
                const data=fileData.data
                if(!Array.isArray(data)){
                    alert('Incorrect format')
                    return
                }
                let flag=0
                data.forEach(board=>{
                    if(!board.id||!board.name||!board.subjects||!Array.isArray(board.subjects)||board.subjects.length===0){
                        alert('Incorrect format')
                        flag=1
                        return
                    }
                    board.subjects.forEach(sub=>{
                        if(!sub.id||!sub.name||!sub.status||!sub.boardId||!sub.priority){
                            alert('Incorrect format')
                            flag=1
                            return
                        }
                    })
                })
                if(flag){
                    return
                }else{
                    if(confirm('Are you sure you want to replace current data?')){
                        setData(fileData.data)
                        alert('Import successful')
                        e.target.value=null
                    }else{
                        alert('Import cancelled')
                    }
                }
            }
        }
        reader.readAsText(file)

    }
    function clearData(){
        if(confirm('Are you sure you want to clear all data? This is irreversible')){
            setData([])
        }else{
            return
        }
    }
    return (
  <div className="share-page">

    <div className="share-container">

      <h1 className="share-title">Data Management</h1>


      <div className="share-section export-section">

        <h2 className="section-title">Backup</h2>

        <p className="section-desc">
          Download a copy of all your data.
        </p>

        <button
          onClick={downloadBackup}
          className="btn-primary backup-btn"
        >
          Download Backup
        </button>

      </div>

      <div className="share-section import-section">

        <h2 className="section-title">Restore</h2>

        <p className="section-desc">
          Upload a backup file to restore your data.
        </p>

        <label className="file-upload">

          <input
            className="file-input"
            onChange={handleFileChange}
            type="file"
            accept=".json"
          />

          <span className="file-label">
            Choose Backup File
          </span>

        </label>

      </div>


      <div className="share-section danger-section">

        <h2 className="section-title danger-title">
          Clear Data
        </h2>

        <p className="section-desc danger-desc">
          This will permanently delete all data.
        </p>

        <button
          onClick={clearData}
          className="delete-everything-btn"
        >
          Clear All Data
        </button>

      </div>

    </div>

  </div>
)
}