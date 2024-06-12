import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { unitDropdown } from "./utils/dropdownData";
import { FaRegEdit } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LotManageModal from "./LotManageModal";

const purchaseDefaultValue = {
  productName: "Rice 100 mg",
  discount: 100,
  tax: 100,
  subTotal: 100,
  selectedUnits: [],
  selectedLots: [],
};

const PurchasePage = () => {
  const [modal, setModal] = useState(false);

  const schemaResolver = yup.object().shape({
    productName: yup.string().required(),
    discount: yup.number().required(),
    tax: yup.number().required(),
    subTotal: yup.number().required(),
    selectedUnits: yup
      .array()
      .of(
        yup.object().shape({
          checked: yup.boolean().required(),
          unit: yup.string().required(),
          purchasePrice: yup.number().required(),
          quantity: yup.number().min(1).required(),
        })
      )
      .min(1),

    selectedLots: yup.array().of(
      yup.object().shape({
        checked: yup.boolean().required(),
        lot: yup.string().required(),
        units: yup.array().of(
          yup.object().shape({
            qty: yup.string().required(),
            price: yup.string().required(),
          })
        ),
      })
    ),
  });

  const methods = useForm({
    defaultValues: purchaseDefaultValue,
    resolver: yupResolver(schemaResolver),
  });
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = methods;

  const toggle = () => {
    setModal(!modal);
  };

  let watchSelectedUnits = watch("selectedUnits");
  let watchSelectedLots = watch("selectedLots");
  const { append, remove } = useFieldArray({ name: "selectedUnits", control });

  const handleSelectedUnit = (e, unit) => {
    if (e.target.checked) {
      const alreadyChecked = watchSelectedUnits.findIndex(
        (unit) => unit.unit === unit?.value
      );

      if (alreadyChecked === -1) {
        append({
          checked: true,
          unit: unit.value,
          purchasePrice: 0,
          salePrice: 0,
          quantity: 0,
        });
      }
    } else {
      const findIndex = watchSelectedUnits.findIndex(
        (item) => item.unit === unit.value
      );

      if (findIndex !== -1) {
        // If found, remove the unit from openingStocksFields
        remove(findIndex);
      }
    }
  };

  console.log(errors, watch());

  const onSubmit = (formData) => {};

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Table className="w-75 mx-auto mt-5 table-bordered">
          <thead className="text-center">
            <tr>
              <th>Produtct</th>
              <th style={{ minWidth: "200px" }}>Unit</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Controller
                  name="productName"
                  control={control}
                  render={(field) => (
                    <input
                      {...register("productName")}
                      {...field}
                      label="productName"
                      className="form-control"
                    />
                  )}
                />
                {errors?.productName && (
                  <p className="text-danger">{errors?.productName.message}</p>
                )}
              </td>
              <td>
                {unitDropdown.map((unit) => {
                  const isChecked = watchSelectedUnits?.some(
                    (itemUnit) => itemUnit.unit === unit?.value
                  );

                  return (
                    <div key={unit.value}>
                      <input
                        id={unit.value}
                        type="checkbox"
                        className="form-check-input"
                        checked={isChecked}
                        onChange={(e) => handleSelectedUnit(e, unit)}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={unit.value}
                      >
                        {unit.label}
                      </label>
                    </div>
                  );
                })}

                {errors.selectedUnits && (
                  <p className="text-danger">{errors.selectedUnits.message}</p>
                )}
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Discount"
                  {...register("discount")}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Tax"
                  {...register("tax")}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Sub Total"
                  disabled
                  value={0}
                  {...register("subTotal")}
                />
              </td>
              <td className="text-center">
                <FaRegEdit className="text-primary" onClick={toggle} />
              </td>
            </tr>

            {!watchSelectedLots?.length &&
              watchSelectedUnits?.map((unit, index) => {
                const findUnit = unitDropdown.find(
                  (item) => unit.unit === item?.value
                );
                if (findUnit) {
                  return (
                    <tr key={unit.id}>
                      <td colSpan={3} className="text-end pt-3">
                        {unit.name}
                      </td>
                      <td>
                        <div className="d-flex gap-1 align-items-baseline">
                          <p>Qty</p>
                          <Controller
                            name={`selectedUnits[${index}].quantity`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="form-control"
                                label="Quantity"
                                type="number"
                              />
                            )}
                          />
                        </div>
                        {errors?.selectedUnits &&
                          errors?.selectedUnits[index]?.quantity && (
                            <p className="text-danger">
                              {errors?.selectedUnits[index].quantity.message}
                            </p>
                          )}
                      </td>
                      <td colSpan={2}>
                        <div className="d-flex gap-1 align-items-baseline">
                          <p>Price</p>
                          <Controller
                            name={`selectedUnits[${index}].purchasePrice`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="form-control"
                                label="Price"
                                type="number"
                              />
                            )}
                          />
                        </div>
                        {errors?.selectedUnits &&
                          errors?.selectedUnits[index]?.purchasePrice && (
                            <p className="text-danger">
                              {
                                errors?.selectedUnits[index].purchasePrice
                                  .message
                              }
                            </p>
                          )}
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </Table>
        <LotManageModal
          modal={modal}
          setModal={setModal}
          toggle={toggle}
          quantity={watch("quantity")}
          data={watch()}
        />
        <div className="text-center">
          <Button className="" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
};

export default PurchasePage;
