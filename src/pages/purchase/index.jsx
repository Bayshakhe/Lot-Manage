import React, { useState, useEffect } from "react";
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
  productName: "",
  selectedProduct: [],
  selectedLots: [],
};

const PurchasePage = () => {
  const [modal, setModal] = useState(false);

  const schemaResolver = yup.object().shape({});

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

  console.log(watch());

  const onSubmit = (formData) => {
    console.log("Form Data Submitted: ", formData);
  };

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
                        // {...register(`selectedProduct[${productIndex}].value`)}
                        type="text"
                        className="form-control"
                        value={selectedProduct.label}
                        // onChange={() => {}}
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
                            <input
                              id={`selectedProduct[${productIndex}].units[${unitIndex}]`}
                              type="checkbox"
                              className="form-check-input"
                              checked={unit.checked || false}
                              onChange={(e) =>
                                setValue(
                                  `selectedProduct[${productIndex}].units[${unitIndex}].checked`,
                                  e.target.checked
                                )
                              }
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
                      <FaRegEdit
                        key={productIndex}
                        className="text-primary"
                        onClick={toggle}
                      />
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
                              {errors?.selectedUnits &&
                                errors?.selectedUnits[unitIndex]?.quantity && (
                                  <p className="text-danger">
                                    {
                                      errors?.selectedUnits[unitIndex].quantity
                                        .message
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
