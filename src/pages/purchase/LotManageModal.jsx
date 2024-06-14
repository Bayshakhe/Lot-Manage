import { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { lotData } from "./utils/lotData";

const LotManageModal = ({ modal, setModal, toggle }) => {
  const [hasError, setHasError] = useState();
  const methods = useFormContext();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const lotDropdown = lotData.filter(
    (lot) => lot.product === modal?.selectedProduct?.value
  );

  const watchSelectedLots = watch(
    `selectedProduct[${modal?.productIndex}].selectedLots`,
    []
  );
  const { append: lotAppend, remove: lotRemove } = useFieldArray({
    name: `selectedProduct[${modal?.productIndex}].selectedLots`,
    control,
  });

  const handleSelectedLot = (e, lot) => {
    if (e.target.checked) {
      lotAppend(lot.value);
    } else {
      lotRemove(lot.value);
    }
  };

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
                          <Controller
                            name={`selectedProduct[${modal?.productIndex}].lotProducts[${lotIndex}].lot`}
                            control={control}
                            defaultValue={lot.value}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className="form-control d-none"
                              />
                            )}
                          />
                          <input
                            id={lot.value}
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              handleSelectedLot(e, lot);
                              setValue(
                                `selectedProduct[${modal?.productIndex}].lotProducts[${lotIndex}].checked`,
                                e.target.checked
                              );
                            }}
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

                <tbody>
                  <tr>
                    <th className="text-center fw-normal bg-light">Unit</th>
                    <th className="text-center fw-normal bg-light">Quantity</th>
                    <th className="text-center fw-normal bg-light">Price</th>
                  </tr>
                  {modal?.selectedProduct.units?.map((unit, unitIndex) => {
                    if (unit.checked) {
                      return (
                        <tr key={unit?.value}>
                          <td
                            style={{ minWidth: "90px" }}
                            className="text-center fw-bold"
                          >
                            {unit?.label}
                          </td>
                          <td>
                            <Controller
                              name={`selectedProduct[${modal?.productIndex}].lotProducts[${lotIndex}].units[${unitIndex}].quantity`}
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
                            {errors.selectedLots?.[lotIndex]?.units?.[unitIndex]
                              ?.quantity && (
                              <p className="text-danger">
                                {
                                  errors.selectedLots?.[lotIndex]?.units?.[
                                    unitIndex
                                  ]?.quantity.message
                                }
                              </p>
                            )}
                          </td>
                          <td>
                            <Controller
                              name={`selectedProduct[${modal?.productIndex}].lotProducts[${lotIndex}].units[${unitIndex}].purchasePrice`}
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
