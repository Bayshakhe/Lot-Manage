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
import { productDropdown } from "./utils/productData";

const purchaseDefaultValue = {
  productName: "",
  discount: 100,
  tax: 100,
  subTotal: 100,
  selectedProduct: [],
  selectedUnits: [],
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
    formState: { errors },
  } = methods;

  const toggle = () => {
    setModal(!modal);
  };
  let watchSelectedProduct = watch("selectedProduct");
  const { append: productAppend, remove: productRemove } = useFieldArray({
    name: "selectedProduct",
    control,
  });

  let watchSelectedUnits = watch("selectedUnits");
  let watchSelectedLots = watch("selectedLots");
  const { append: unitAppend, remove: unitRemove } = useFieldArray({
    name: "selectedUnits",
    control,
  });

  const handleSelectedProduct = (value, product) => {
    const findProduct = product?.find(
      (productItem) => productItem.value === value
    );

    productAppend(findProduct);
  };

  const handleSelectedUnit = (e, unit) => {
    if (e.target.checked) {
      const alreadyChecked = watchSelectedUnits.findIndex(
        (unit) => unit.unit === unit?.value
      );

      if (alreadyChecked === -1) {
        unitAppend({
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
        unitRemove(findIndex);
      }
    }
  };

  console.log(errors, watch());

  const onSubmit = (formData) => {};

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <select
            {...register("selectedProduct")}
            className="form-select w-25 mx-auto mt-5"
            placeholder="Select product"
            onChange={(e) =>
              handleSelectedProduct(e.target.value, productDropdown)
            }
          >
            {watchSelectedProduct?.length > 0
              ? productDropdown
                  .filter(
                    (perProduct) =>
                      !watchSelectedProduct?.some(
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
          {watchSelectedProduct?.length > 0 &&
            watchSelectedProduct?.map((selectedProduct) => (
              <>
                {console.log({ selectedProduct })}
                <tbody>
                  <tr>
                    <td>
                      <input
                        {...register("productName")}
                        type="text"
                        label={selectedProduct.label}
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
                        <p className="text-danger">
                          {errors.selectedUnits.message}
                        </p>
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
                                    {
                                      errors?.selectedUnits[index].quantity
                                        .message
                                    }
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
              </>
            ))}
        </Table>

        <LotManageModal
          modal={modal}
          setModal={setModal}
          toggle={toggle}
          quantity={watch("quantity")}
          data={watch()}
        />

        <div className="text-center">
          {watchSelectedProduct?.length > 0 && (
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
