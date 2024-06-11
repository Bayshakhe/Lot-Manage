import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { unitDropdown } from "./utils/dropdownData";
import { FaRegEdit } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LotManageModal from "./LotManageModal";

const purchaseDefaultValue = {
  productName: "fufheofje",
  units: [],
  discount: 0,
  tax: 0,
  lotProducts: [],
};

const PurchasePage = () => {
  const [modal, setModal] = useState(false);

  const schemaResolver = yup.object().shape({
    productName: yup.string().required("This field is required"),
    units: yup
      .array()
      .of(
        yup.object().shape({
          checked: yup.boolean(),
          quantity: yup.number().when(
            "checked",
            (a, b, value) => {
              if (value?.parent?.checked) {
                if (
                  value?.from &&
                  value?.from[1]?.value?.lotProducts?.length > 0
                ) {
                  value.from[1].value.lotProducts.map((item) => {
                    if (item.checked) {
                      return yup.number().notRequired();
                    }
                  });
                } else {
                  return yup
                    .number()
                    .min(0)
                    .typeError(() => "Quantity must be valid number")
                    .required(() => "Quantity is required");
                }
              }
            },
            [["checked", "checked"]]
          ),
          price: yup.number().when(
            "checked",
            (a, b, value) => {
              if (value?.parent?.checked) {
                if (
                  value?.from &&
                  value?.from[1]?.value?.lotProducts?.length > 0
                ) {
                  value.from[1].value.lotProducts.map((item) => {
                    if (item.checked) {
                      return yup.number().notRequired();
                    }
                  });
                } else {
                  return yup
                    .number()
                    .min(0)
                    .typeError(() => "Price must be valid number")
                    .required(() => "Price is required");
                }
              }
            },
            [["checked", "checked"]]
          ),
        })
      )
      .test(
        "at-least-one-selected",
        "You must select at least one unit",
        function (units) {
          return units.some((unit) => unit.checked);
        }
      ),
    lotProducts: yup.array().of(
      yup.object().shape({
        checked: yup.boolean(),
        units: yup.array().of(
          yup.object().shape({
            quantity: yup.number().when("checked", (a, b, value) => {
              console.log({ value });

              if (value.from && value?.from[2].value.lotProducts?.length > 0) {
                value.from[2].value.lotProducts.map((item) => {
                  if (item.checked) {
                    return yup
                      .number()
                      .min(0)
                      .typeError(() => "Quantity must be valid number")
                      .required(() => "Quantity is required");
                  } else {
                    return yup.number().notRequired();
                  }
                });
              }
            }),
            price: yup.number().when("checked", (a, b, value) => {
              value.from &&
                value?.from[2].value.lotProducts?.length > 0 &&
                value?.from[2].value.lotProducts.map((item) => {
                  if (item.checked) {
                    return yup
                      .number()
                      .min(0)
                      .typeError(() => "Price must be valid number")
                      .required(() => "Price is required");
                  } else {
                    return yup.number().notRequired();
                  }
                });
            }),
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
    setValue,
  } = methods;

  const toggle = () => {
    setModal(!modal);
  };

  const handleUnitSelect = (target, unit, index) => {
    const currentUnits = watch("units");

    if (target) {
      // When checked, add or update the unit
      const updatedUnits = currentUnits.some(
        (item) => item.value === unit.value
      )
        ? currentUnits.map((item) =>
            item.value === unit.value ? { ...item, checked: true, index } : item
          )
        : [...currentUnits, { ...unit, checked: true, index }];

      setValue("units", updatedUnits);
    } else {
      // When unchecked, remove the unit or set checked to false
      const updatedUnits = currentUnits.map((item) =>
        item.value === unit.value ? { ...item, checked: false, index } : item
      );

      setValue("units", updatedUnits);
    }
  };

  const onSubmit = () => {
    console.log(watch());
  };

  console.log({ errors, watch: watch() });

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
                {unitDropdown.map((unit, index) => (
                  <div key={unit.value}>
                    <Controller
                      control={control}
                      {...register(`units`)}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            id={unit.value}
                            type="checkbox"
                            className="form-check-input"
                            value={unit.value}
                            onChange={(e) =>
                              handleUnitSelect(e.target.checked, unit, index)
                            }
                          />
                          <label
                            className="form-check-label ms-2"
                            htmlFor={unit.value}
                          >
                            {unit.label}
                          </label>
                        </>
                      )}
                    />
                  </div>
                ))}

                {errors.units && (
                  <p className="text-danger">{errors.units.message}</p>
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
            {watch("units")?.map(
              (unit, index) =>
                unit.checked && (
                  <tr key={unit.value}>
                    <td colSpan={3}></td>
                    <td>
                      <div className="d-flex gap-1 align-items-baseline">
                        <p>Qty</p>
                        <Controller
                          name={`units[${index}].quantity`}
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
                      {errors?.units && errors?.units[index]?.quantity && (
                        <p className="text-danger">
                          {errors?.units[index].quantity.message}
                        </p>
                      )}
                    </td>
                    <td colSpan={2}>
                      <div className="d-flex gap-1 align-items-baseline">
                        <p>Price</p>
                        <Controller
                          name={`units[${index}].price`}
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
                      {errors?.units && errors?.units[index]?.price && (
                        <p className="text-danger">
                          {errors?.units[index].price.message}
                        </p>
                      )}
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </Table>
        <div className="text-center">
          <Button className="" type="submit">
            Submit
          </Button>
        </div>
      </Form>
      <LotManageModal
        modal={modal}
        setModal={setModal}
        toggle={toggle}
        units={watch("units")}
      />
    </FormProvider>
  );
};

export default PurchasePage;
