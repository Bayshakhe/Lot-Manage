import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { unitDropdown } from "./utils/dropdownData";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { lotData } from "./utils/lotData";

const LotManageModal = ({ modal, setModal, toggle }) => {
  const [hasError, setHasError] = useState();
  const methods = useFormContext();

  const {
    control,
    formState: { errors },
    watch,
  } = methods;

  const watchSelectedProduct = watch("selectedProduct", []);

  let watchSelectedLots = watch("selectedLots");
  const { append, remove } = useFieldArray({ name: "selectedLots", control });

  const lotDropdown = lotData.filter((lot) => lot.product === modal.value);

  const handleSelectedLot = (e, lot) => {
    if (e.target.checked) {
      const alreadyChecked = watchSelectedLots.findIndex(
        (lotItem) => lotItem.lot === lot?.value
      );

      if (alreadyChecked === -1) {
        append({
          checked: true,
          lot: lot.value,
        });
      }
    } else {
      const findIndex = watchSelectedLots.findIndex(
        (lotItem) => lotItem.lot === lot.value
      );

      if (findIndex !== -1) {
        // If found, remove the unit from openingStocksFields
        remove(findIndex);
      }
    }
  };

  console.log(watch());

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
        <div id="lotManage" noValidate className="w-100">
          {lotDropdown?.map((lot, lotIndex) => {
            const isChecked = watchSelectedLots?.some(
              (lotItem) => lotItem.lot === lot?.value
            );

            return (
              <Table
                className="align-middle"
                size="sm"
                key={lot?.value}
                bordered
              >
                <thead className="table-light">
                  <tr>
                    <th
                      colSpan={3}
                      className="text-center bg-dark text-white"
                      style={{ maxWidth: "180px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <div>
                          <input
                            id={lot.value}
                            type="checkbox"
                            className="form-check-input"
                            checked={isChecked}
                            onChange={(e) => handleSelectedLot(e, lot)}
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor={lot.value}
                          >
                            {lot.label}
                          </label>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                {console.log({ lot })}
                <tbody>
                  {modal.units?.map((unit, unitIndex) => {
                    if (unit.checked) {
                      return (
                        <React.Fragment key={unit.value}>
                          <tr>
                            <th className="text-center fw-normal bg-light">
                              Unit
                            </th>
                            <th className="text-center fw-normal bg-light">
                              Quantity
                            </th>
                            <th className="text-center fw-normal bg-light">
                              Price
                            </th>
                          </tr>
                          <tr key={unit?.value}>
                            <td
                              style={{ minWidth: "90px" }}
                              className="text-center fw-bold"
                            >
                              {unit?.label}
                            </td>
                            <td>
                              <Controller
                                name={`selectedLots[${lotIndex}].units[${unitIndex}].qty`}
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
                              {errors.selectedLots?.[lotIndex]?.units?.[
                                unitIndex
                              ]?.qty && (
                                <p className="text-danger">
                                  {
                                    errors.selectedLots?.[lotIndex]?.units?.[
                                      unitIndex
                                    ]?.qty.message
                                  }
                                </p>
                              )}
                            </td>
                            <td>
                              <Controller
                                name={`selectedLots[${lotIndex}].units[${unitIndex}].price`}
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
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    }
                  })}
                </tbody>
              </Table>
            );
          })}
        </div>

        <div className="mt-5 text-end">
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LotManageModal;
