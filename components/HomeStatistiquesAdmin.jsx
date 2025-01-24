import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StaticIP } from '@/config/staticip'
import StatistiquesAdmin from './StatistiquesAdmin'

const HomeStatistiquesAdmin = () => {
    const [totaljanvier, setTotaljanvier] = useState(0)
    const [totalfevrier, setTotalfevrier] = useState(0)
    const [totalmars, setTotalmars] = useState(0)
    const [totalavril, setTotalavril] = useState(0)
    const [totalmai, setTotalmai] = useState(0)
    const [totaljuin, setTotaljuin] = useState(0)
    const [totaljuillet, setTotaljuillet] = useState(0)
    const [totalaout, setTotalaout] = useState(0)
    const [totalseptembre, setTotalseptembre] = useState(0)
    const [totaloctobre, setTotaloctobre] = useState(0)
    const [totalnovembre, setTotalnovembre] = useState(0)
    const [totaldecembre, setTotaldecembre] = useState(0)


    const [totalexecutejanvier, setTotalexecutejanvier] = useState(0)
    const [totalexecutefevrier, setTotalexecutefevrier] = useState(0)
    const [totalexecutemars, setTotalexecutemars] = useState(0)
    const [totalexecuteavril, setTotalexecuteavril] = useState(0)
    const [totalexecutemai, setTotalexecutemai] = useState(0)
    const [totalexecutejuin, setTotalexecutejuin] = useState(0)
    const [totalexecutejuillet, setTotalexecutejuillet] = useState(0)
    const [totalexecuteaout, setTotalexecuteaout] = useState(0)
    const [totalexecuteseptembre, setTotalexecuteseptembre] = useState(0)
    const [totalexecuteoctobre, setTotalexecuteoctobre] = useState(0)
    const [totalexecutenovembre, setTotalexecutenovembre] = useState(0)
    const [totalexecutedecembre, setTotalexecutedecembre] = useState(0)


    useEffect(() => {
        axios.get(`${StaticIP}api/statistique/tache_janvier`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotaljanvier(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_fevrier`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalfevrier(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_mars`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalmars(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_avril`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalavril(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_mai`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalmai(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_juin`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotaljuin(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_juillet`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotaljuillet(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_aout`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalaout(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_septembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalseptembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_octobre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotaloctobre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_novembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalnovembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_decembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotaldecembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))


          //LES TACHES EXECUTEES

          axios.get(`${StaticIP}api/statistique/tache_execute_janvier`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutejanvier(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_fevrier`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutefevrier(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_mars`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutemars(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_avril`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecuteavril(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_mai`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutemai(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_juin`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutejuin(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_juillet`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutejuillet(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_aout`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecuteaout(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_septembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecuteseptembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_octobre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecuteoctobre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_novembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutenovembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))

          axios.get(`${StaticIP}api/statistique/tache_execute_decembre`)
          .then(result => {
            //console.log(result.data)
            if (result.data.Status) {
              setTotalexecutedecembre(result.data.Result)
            } else {
              alert(result.data.Error)
            }
          }).catch(err => console.log(err))
    }, [])


    const attendanceData = [
        { month: 'Janvier', totalmois: `${totaljanvier}`, totalexecute: `${totalexecutejanvier}` },
        { month: 'Février', totalmois: `${totalfevrier}`, totalexecute: `${totalexecutefevrier}` },
        { month: 'Mars', totalmois: `${totalmars}`, totalexecute: `${totalexecutemars}` },
        { month: 'Avril', totalmois: `${totalavril}`, totalexecute: `${totalexecuteavril}`},
        { month: 'Mai', totalmois: `${totalmai}`, totalexecute: `${totalexecutemai}`},
        { month: 'Juin', totalmois: `${totaljuin}`, totalexecute: `${totalexecutejuin}`},
        { month: 'Juillet', totalmois: `${totaljuillet}`, totalexecute: `${totalexecutejuillet}` },
        { month: 'Août', totalmois: `${totalaout}`, totalexecute: `${totalexecuteaout}` },
        { month: 'Septembre', totalmois: `${totalseptembre}`, totalexecute: `${totalexecuteseptembre}` },
        { month: 'Octobre', totalmois: `${totaloctobre}`, totalexecute: `${totalexecuteoctobre}` },
        { month: 'Novembre', totalmois: `${totalnovembre}`, totalexecute: `${totalexecutenovembre}` },
        { month: 'Décembre', totalmois: `${totaldecembre}`, totalexecute: `${totalexecutedecembre}` },
      ];
  return (
    <div>
        <StatistiquesAdmin data={attendanceData} />
    </div>
  )
}

export default HomeStatistiquesAdmin