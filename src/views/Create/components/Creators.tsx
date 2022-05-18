import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { validateSingle } from 'utils/validate'
import { PropertyUser } from 'state/types'
import {Button} from '../../../components/Button/index'

// interface IProps {
//   users: PropertyUser[]
//   errors: { [key: string]: string }
//   onChange?: (users: PropertyUser[]) => void
//   onError?: (key: string, error: string) => void
// }

// const Creators: React.FC<IProps> = ({ users, errors, onChange, onError }) => {
const Creators: React.FC = () => {

  // const [currentUsers, setUsers] = useState(users)

  // const addCreator = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.preventDefault()
  //   setUsers([...currentUsers, {}])
  // }
  // const removeCreator = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, idx: number) => {
  //   event.preventDefault()
  //   currentUsers.splice(idx, 1)
  //   setUsers(currentUsers)
  //   onChange(currentUsers)
  // }
  // const updateCreator = (idx: number, value: string, name: string, type: string, mandatory = true) => {
  //   const { value: newValue, error } = validateSingle(value, type, mandatory)
  //   if (error) {
  //     onError(`creator-${idx}-${name}`, error)
  //   } else {
  //     currentUsers[idx][name] = newValue
  //     setUsers(currentUsers)
  //     onError(`creator-${idx}-${name}`, null)
  //   }
  // }

  // const owners = (
  //   <div id="properties-div">
  //     <Form.Label className="h5 input-color">Creators</Form.Label>

  //     {currentUsers?.map((user, idx) => (
  //       <div id={`property-num-${idx + 1}`} className="form-row mb-1">
  //         <div className="form-group col-12 col-sm-6">
  //           <Form.Control
  //             disabled={idx === 0}
  //             className="property-key text-white form-control"
  //             defaultValue={user.address}
  //             onChange={(e) => updateCreator(idx, e.target.value, 'address', 'address')}
  //             placeholder="Creator address"
  //             isInvalid={!!errors[`creator-${idx}-address`]}
  //           />
  //           {errors[`creator-${idx}-address`] ? <Form.Control.Feedback type="invalid">{errors[`creator-${idx}-address`]}</Form.Control.Feedback> : null}
  //         </div>
  //         <div className="form-group col-12 col-sm-2 mt-2 mt-sm-0">
  //           <InputGroup>
  //             <Form.Control
  //               className="property-value text-white form-control"
  //               type="number"
  //               defaultValue={user.value}
  //               onChange={(e) => updateCreator(idx, e.target.value, 'value', 'number')}
  //               placeholder="0-100"
  //               isInvalid={!!errors[`creator-${idx}-value`]}
  //             />
  //             <InputGroup.Text>%</InputGroup.Text>
  //             {errors[`creator-${idx}-value`] ? <Form.Control.Feedback type="invalid">{errors[`creator-${idx}-value`]}</Form.Control.Feedback> : null}
  //           </InputGroup>
  //         </div>

  //         {idx !== 0 ? (
  //           <div className="form-group col-12 col-sm-2 mt-2 mt-sm-0 removeUser">
  //             <button onClick={(e) => removeCreator(e, idx)} type="button">
  //               <i className="fas fa-user-minus" />
  //             </button>
  //           </div>
  //         ) : null}
  //         <br />
  //       </div>
  //     ))}

  //     <button className="create-btn mt-3" style={{ paddingLeft: '20px' }} onClick={addCreator} type="button">
  //       Add new creator
  //     </button>
  //   </div>
  // )

  const owners=(
    <div>
      <Form.Label className="h5 text-white">Creators</Form.Label>
      <div className="form-row mb-1">
        <div className="form-group  col-12 col-sm-6">
          <Form.Control
            className="property-key text-white create-form form-control"
            placeholder="Creator address"
          />
        </div>
        <div className="form-group col-12 col-sm-2 mt-2 mt-sm-0">
          <InputGroup>
            <Form.Control
              className="property-value create-prepend-form text-white form-control"
              type="number"
              placeholder="0-100"
            />
            <InputGroup.Text className="create-append-form text-white">%</InputGroup.Text>
          </InputGroup>
        </div>

          <div className="form-group col-12 col-sm-2 mt-2 mt-sm-0 removeUser">
            <button type="button">
              <i className="fas fa-user-minus minus-icon-user" />
            </button>
          </div>
        <br />
      </div>
      {/* <button className="create-btn px-3 pointer py-2 text-white mt-2" style={{ paddingLeft: '20px' }} type="button">
        Add new creator
      </button> */}
      <Button>Add new creator</Button>
    </div>
  )

  return (
    <div className="container">
      <div className="form-row">
        <div className="form-group col-md-12">{owners}</div>
      </div>
    </div>
  )
}

export default Creators
