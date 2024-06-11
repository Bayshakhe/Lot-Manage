import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { lotDropdown, unitDropdown } from "./utils/dropdownData";
import { Controller, useFormContext } from "react-hook-form";

const LotManageModal = ({ modal, setModal, toggle, units, data }) => {
  const [hasError, setHasError] = useState();
  const methods = useFormContext();

  const {
    register,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = methods;

  const handleLotSelect = (target, lot, index) => {
    const currentLots = watch("lotProducts");
    const currentUnits = watch("units").filter((unit) => unit.checked === true);

    if (target) {
      currentLots[index] = {
        ...lot,
        index,
        checked: true,
        units: currentUnits,
      };
    } else {
      currentLots[index] = {
        ...lot,
        index,
        checked: false,
        units: currentUnits,
      };
    }
  };

  const handleLotManage = () => {
    data?.lotProducts.map((item) => {
      console.log({ item });
      if (item.checked) {
        item.units.map((unit, i) => {
          if (!unit.quantity) {
            setError(`lotProducts[${item.index}].units[${i}].quantity`, {
              type: "custom",
              message: "Quantity is required",
            });
          } else {
            clearErrors(`lotProducts[${item.index}].units[${i}].quantity`);
          }
        });
      } else {
        item.units.map((unit, i) => {
          clearErrors(`lotProducts[${item.index}].units[${i}].quantity`);
        });
      }
    });

    // if (errors?.lotProducts) {
    //   setModal(false);
    // } else if (!errors?.lotProducts) {
    //   setModal(true);
    // }

    setModal(false);
  };

  // useEffect(() => {
  //   if (errors?.lotProducts?.length < 0) {
  //     setModal(false);
  //   } else {
  //     setModal(true);
  //   }
  // }, [errors]);

  return (
    <Modal
      show={modal}
      onHide={toggle}
      backdrop="static"
      keyboard={false}
      size="md"
    >
      <Modal.Header onHide={toggle} closeButton>
        <Modal.Title>Manage Lot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="lotManage" noValidate className="w-100">
          {lotDropdown?.map((item, index) => (
            <Table
              className="align-middle"
              size="sm"
              key={item?.value}
              bordered
            >
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{ maxWidth: "180px" }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <Controller
                        control={control}
                        name={`lotProducts[${index}].checked`}
                        render={(field) => (
                          <>
                            <input
                              {...field}
                              id={item.value}
                              type="checkbox"
                              className="form-check-input"
                              value={item.value}
                              defaultChecked={watch(
                                `lotProducts[${index}].checked`
                              )}
                              onChange={(e) =>
                                handleLotSelect(e.target.checked, item, index)
                              }
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor={item.value}
                            >
                              {item.label}
                            </label>
                          </>
                        )}
                      />
                      {errors.lotProducts?.[index]?.checked && (
                        <p className="text-danger">This is required.</p>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <Table className="align-middle" size="sm">
                  <thead className="text-dark">
                    <tr>
                      <th className="text-center">Unit</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units?.map(
                      (unit, unitInx) =>
                        unit.checked && (
                          <tr key={unit?.value}>
                            <td style={{ minWidth: "90px" }}>{unit?.label}</td>
                            <td>
                              <Controller
                                name={`lotProducts[${index}].units[${unitInx}].quantity`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    className="form-control"
                                    label="Quantity"
                                    style={{ maxWidth: "180px" }}
                                  />
                                )}
                              />
                              {errors?.lotProducts?.[index]?.units?.[unitInx]
                                ?.quantity && (
                                <p className="text-danger">
                                  {
                                    errors?.lotProducts[index].units[unitInx]
                                      .quantity.message
                                  }
                                </p>
                              )}
                            </td>
                            <td>
                              <Controller
                                name={`lotProducts[${index}].units[${unitInx}].price`}
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    className="form-control"
                                    label="Price"
                                    style={{ maxWidth: "180px" }}
                                  />
                                )}
                              />
                              {errors?.lotProducts?.[index]?.units?.[unitInx]
                                ?.price && (
                                <p className="text-danger">
                                  {
                                    errors?.lotProducts[index].units[unitInx]
                                      .price.message
                                  }
                                </p>
                              )}
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>
              </tbody>
            </Table>
          ))}
        </form>

        <div className="mt-5 text-end">
          <Button type="submit" variant="primary" onClick={handleLotManage}>
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LotManageModal;
