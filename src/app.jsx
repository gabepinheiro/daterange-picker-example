import { useEffect, useReducer } from 'react'

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle'

import data from './data.json'
    
const getDateToNumber = (date) => 
  Number(new Date(date).toLocaleDateString().replace(/(\d\d)\/(\d\d)\/(\d\d\d\d)/,'$3$2$1'))
    
const isRange = (date, range) => {
  const [start, end] = range

  const dateNumber = getDateToNumber(date)
  const startDateNumber = getDateToNumber(start)
  const endDateNumber = getDateToNumber(end)

  return dateNumber >= startDateNumber && dateNumber <= endDateNumber
}

function contractsReducer (state, action) {
  switch (action.type) {
    case 'FETCH_CONTRACTS':
      return {
        ...state,
        contracts: action.payload,
      }
    case 'FILTER_CONTRACTS_BY_RANGE_DATE': 
      return {
        ...state,
        filterContractsByRangeDate: state.contracts.filter(contract => {
          return isRange(new Date(contract.criadoEm), action.payload)
        }),
        date: [...action.payload]
      }  

    default:
      break;
  }
}

export function App() {
  const [state, dispatch] = useReducer(contractsReducer, {
    date: [new Date(), new Date()] 
  })

  useEffect(() => {
    dispatch({type: 'FETCH_CONTRACTS', payload: data })
  }, [])
  
  const handleDateRangeChange = (dateRange) => {
    dispatch({ type: 'FILTER_CONTRACTS_BY_RANGE_DATE', payload: dateRange })
  }

  return (
    <>
      <DateRangePicker
        value={state.date}
        onChange={handleDateRangeChange}
        locale="pt-BR"
        format="dd-MM-yyyy"
        closeCalendar={false}
      />
    <div>
      <ul>
        {!!state.filterContractsByRangeDate && (
          state.filterContractsByRangeDate.map(contract => {
          return <li key={contract.criadoEm}>{contract.criadoEm}</li>
        }))
        }
      </ul>
    </div>      
    </>
  )
}
