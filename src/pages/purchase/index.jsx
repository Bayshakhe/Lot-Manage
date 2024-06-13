import React, { useState } from "react";
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
import { productDropdown } from "./utils/productData";

const purchaseDefaultValue = {
  selectedProduct: [],
  selectedLots: [],
};

const PurchasePage = () => {
  const [modal, setModal] = useState(false);

  const schemaResolver = yup.object().shape({
    selectedProduct: yup.array().of(
      yup.object().shape({
        // quantity: yup.number().when("checked", {
        //   is: true,
        //   then: (schema) =>
        //     schema
        //       .required("Quantity is required.")
        //       .min(1, "Quantity must be at least 1."),
        //   otherwise: (schema) => schema.notRequired(),
        // }),
        quantity: yup.number().when("checked", (a, b, value) => {
          console.log({ value });
          const findChecked = value?.parent?.units.find(
            (unit) => unit?.checked === true
          );
          if (!findChecked) {
            return yup.object().shape({}).required("must be selected one unit");
          }
        }),
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
    setValue,
    formState: { errors },
  } = methods;

  const toggle = () => {
    setModal(!modal);
  };

  const watchSelectedLots = watch("selectedLots", []);

  const watchSelectedProduct = watch("selectedProduct", []);
  const { append: productAppend, remove: productRemove } = useFieldArray({
    name: "selectedProduct",
    control,
  });

  // const watchSelectedUnits = watch(`selectedProduct.selectedUnits`, []);
  // const { append: unitAppend, remove: unitRemove } = useFieldArray({
  //   name: `selectedProduct.selectedUnits`,
  //   control,
  // });

  const handleSelectedProduct = (value, product) => {
    const findProduct = product?.find(
      (productItem) => productItem.value === value
    );
    if (findProduct) {
      const units = unitDropdown
        .filter((unitItem) =>
          Object.keys(findProduct.purchasePrice).some(
            (unit) => unit === unitItem.value
          )
        )
        .map((unit) => ({
          value: unit.value,
          label: unit.label,
          purchasePrice: findProduct.purchasePrice[unit.value],
        }));

      productAppend({ ...findProduct, units });
    }
  };

  const handleUnitSelected = (e, unit, productIndex) => {
    // if (e.target.checked) {
    //   const alreadyExist = watchSelectedUnits?.some(
    //     (selectedUnit) => selectedUnit === unit.value
    //   );
    //   if (!alreadyExist) {
    //     setValue(`selectedProduct[${productIndex}].selectedUnits`, [...unit.value]);
    //   }
    // } else {
    //   const findIndex = watchSelectedUnits?.findIndex(
    //     (selectedUnit) => selectedUnit === unit.value
    //   );
    //   if (findIndex !== -1) {
    //     setValue(`selectedProduct[${productIndex}].selectedUnits`, [...unit.value])
    //   }
    // }
  };

  const onSubmit = (formData) => {
    console.log("Form Data Submitted: ", formData);
  };

  console.log(errors, watch());

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <select
            // {...register("productList")}
            className="form-select w-25 mx-auto mt-5"
            placeholder="Select product"
            onChange={(e) =>
              handleSelectedProduct(e.target.value, productDropdown)
            }
          >
            {watchSelectedProduct.length > 0
              ? productDropdown
                  .filter(
                    (perProduct) =>
                      !watchSelectedProduct.some(
                        (selectedProduct) =>
                          selectedProduct.value === perProduct.value
                      )
                  )
                  .map((perProduct) => (
                    <option
                      key={perProduct.value}
                      value={perProduct.value}
                      className="form-control"
                    >
                      {perProduct.label}
                    </option>
                  ))
              : productDropdown.map((perProduct) => (
                  <option
                    key={perProduct.value}
                    value={perProduct.value}
                    className="form-control"
                  >
                    {perProduct.label}
                  </option>
                ))}
          </select>
        </div>

        <Table className="w-75 mx-auto mt-2 table-bordered">
          <thead className="text-center">
            <tr>
              <th>Product</th>
              <th style={{ minWidth: "200px" }}>Unit</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {watchSelectedProduct?.length > 0 &&
              watchSelectedProduct.map((selectedProduct, productIndex) => (
                <React.Fragment key={productIndex}>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedProduct.label}
                        disabled
                      />
                      {errors?.productName && (
                        <p className="text-danger">
                          {errors?.productName.message}
                        </p>
                      )}
                    </td>
                    <td>
                      {selectedProduct?.units?.map((unit, unitIndex) => {
                        return (
                          <div key={`${selectedProduct.value}-${unit.value}`}>
                            <Controller
                              control={control}
                              name={`selectedProduct[${productIndex}].selectedUnits`}
                              render={({ field }) => (
                                <input
                                  id={`selectedProduct[${productIndex}].units[${unitIndex}]`}
                                  {...field}
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={unit.checked || false}
                                  onChange={(e) => {
                                    handleUnitSelected(e, unit, productIndex);
                                    setValue(
                                      `selectedProduct[${productIndex}].units[${unitIndex}].checked`,
                                      e.target.checked
                                    );
                                  }}
                                />
                              )}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor={`selectedProduct[${productIndex}].units[${unitIndex}]`}
                            >
                              {unit.label}
                            </label>
                          </div>
                        );
                      })}
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Discount"
                        {...register(
                          `selectedProduct[${productIndex}].discount`
                        )}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Tax"
                        {...register(`selectedProduct[${productIndex}].tax`)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Sub Total"
                        disabled
                        value={0}
                        {...register(
                          `selectedProduct[${productIndex}].subTotal`
                        )}
                      />
                    </td>
                    <td className="text-center">
                      {selectedProduct.units.find(
                        (unit) => unit.checked === true
                      ) && (
                        <FaRegEdit
                          key={productIndex}
                          className="text-primary"
                          onClick={() =>
                            setModal({ selectedProduct, productIndex })
                          }
                        />
                      )}
                    </td>
                  </tr>

                  {!watchSelectedLots?.length &&
                    selectedProduct?.units.map(
                      (unit, unitIndex) =>
                        unit?.checked && (
                          <tr key={unit.id}>
                            <td colSpan={3} className="text-end pt-3">
                              {unit.label}
                            </td>
                            <td>
                              <div className="d-flex gap-1 align-items-baseline">
                                <p>Qty</p>
                                <Controller
                                  name={`selectedProduct[${productIndex}].units[${unitIndex}].quantity`}
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
                              {errors?.selectedProduct &&
                                errors?.selectedProduct[productIndex]?.units[
                                  unitIndex
                                ]?.quantity && (
                                  <p className="text-danger">
                                    {
                                      errors.selectedProduct[productIndex]
                                        .units[unitIndex].quantity.message
                                    }
                                  </p>
                                )}
                            </td>
                            <td colSpan={2}>
                              <div className="d-flex gap-1 align-items-baseline">
                                <p>Price</p>
                                <Controller
                                  name={`selectedProduct[${productIndex}].units[${unitIndex}].purchasePrice`}
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
                                errors?.selectedUnits[unitIndex]
                                  ?.purchasePrice && (
                                  <p className="text-danger">
                                    {
                                      errors?.selectedUnits[unitIndex]
                                        .purchasePrice.message
                                    }
                                  </p>
                                )}
                            </td>
                          </tr>
                        )
                    )}
                </React.Fragment>
              ))}
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
          {watchSelectedProduct.length > 0 && (
            <Button className="" type="submit">
              Submit
            </Button>
          )}
        </div>
      </Form>
    </FormProvider>
  );
};

export default PurchasePage;
