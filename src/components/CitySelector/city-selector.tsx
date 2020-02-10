import * as React from "react";
import * as PropTypes from "prop-types";
import classNames from "classnames";
import { Select, Row, Col, Form } from "antd/es";
import { FormComponentProps } from "antd/es/form";

export interface CitySelectorProps extends FormComponentProps {
  prefixCls?: string;
  className?: string;
  children?: React.ReactNode;
  data?: Array<object>;
  disabled?: boolean;
  onChange?: Function;
  defaultValue?: any;
  form: any;
  size?: any;
}

class CitySelector extends React.Component<CitySelectorProps, any> {
  static defaultProps = {
    disabled: false,
    prefixCls: "fui-city-selector",
    defaultValue: null
  };
  static propTypes = {
    data: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.object
  };
  constructor(props: any) {
    super(props);
    this.state = {
      provinces: props.data,
      cities: [],
      province: null,
      city: null
    };
  }
  isNeedInserted() {
    const { children } = this.props;
    return React.Children.count(children) === 1;
  }

  componentDidMount() {
    const { data: provinces, defaultValue } = this.props;
    if (!provinces) return;

    if (defaultValue && this.state.cities.length === 0) {
      const { provinceName } = defaultValue;
      let province: any;
      province =
        provinces.filter((cur: any) => cur.name === provinceName)[0] || {};
      const cities = province.cityInfo || [];
      this.setState({
        provinces,
        cities,
        province,
        city: cities[0] || {}
      });
    } else {
      this.setState({
        provinces
      });
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { data: provinces, defaultValue } = nextProps;
    if (!provinces) return;

    if (defaultValue && this.state.cities.length === 0) {
      const { provinceName } = defaultValue;
      const province =
        provinces.filter((cur: any) => cur.name === provinceName)[0] || {};
      const cities = province.cityInfo || [];
      this.setState({
        provinces,
        cities,
        province,
        city: cities[0] || {}
      });
    } else {
      this.setState({
        provinces
      });
    }
  }

  handleProvinceChange = (value: any) => {
    const { provinces } = this.state;
    const {
      onChange,
      form: { setFieldsValue }
    } = this.props;
    const province =
      provinces.filter((cur: any) => cur.name === value)[0] || {};
    const cities = province.cityInfo || [];
    const city = cities[0] || {};
    setFieldsValue({
      cityName: city.name
    });
    this.setState(
      {
        province,
        cities,
        city: cities[0] || {}
      },
      () => {
        // const {
        //   city: {
        //     id: cityId,
        //     name: cityName,
        //     areaCode = 0,
        //     latitude = 0,
        //     longitude = 0
        //   },
        //   province: { id: provinceId, name: provinceName }
        // } = this.state;
        const {
          id: cityId,
          name: cityName,
          areaCode = 0,
          latitude = 0,
          longitude = 0
        } = cities[0];
        const { id: provinceId, name: provinceName } = province;
        // tslint:disable-next-line: no-unused-expression
        onChange &&
          onChange({
            provinceId,
            provinceName,
            cityId,
            cityName,
            areaCode,
            latitude,
            longitude
          });
      }
    );
  };

  handleCityChange = (value: any) => {
    const { onChange } = this.props;
    const { cities } = this.state;
    this.setState(
      {
        city: cities.filter((cur: any) => cur.name === value)[0]
      },
      () => {
        const {
          city,
          city: { id: cityId, name: cityName },
          province,
          province: { id: provinceId, name: provinceName }
        } = this.state;
        const data = {
          ...province,
          provinceId,
          provinceName,
          ...city,
          cityId,
          cityName
        };
        delete data.id;
        delete data.name;
        // tslint:disable-next-line: no-unused-expression
        onChange && onChange(data);
      }
    );
  };

  render() {
    const type = "common";
    const { prefixCls, className } = this.props;
    const classes = classNames(prefixCls, className, {
      [`${prefixCls}-${type}`]: type
    });
    const { provinces, cities } = this.state;
    const { disabled, form, defaultValue, size } = this.props;
    // tslint:disable-next-line: one-variable-per-declaration
    let provinceName, cityName;
    if (!!defaultValue) {
      provinceName = defaultValue.provinceName;
      cityName = defaultValue.cityName;
    }
    const { getFieldDecorator } = form;
    return (
      <Row className={classes}>
        <Col span={12}>
          {getFieldDecorator("provinceName", {
            initialValue: provinceName
          })(
            <Select
              onChange={this.handleProvinceChange}
              placeholder="请选择省份"
              disabled={disabled}
              size={size}
            >
              {provinces.map((cur: any) => (
                <Select.Option value={cur.name} key={cur.id}>
                  {cur.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Col>
        <Col span={12}>
          {getFieldDecorator("cityName", {
            initialValue: cityName
          })(
            <Select
              onChange={this.handleCityChange}
              placeholder="请选择城市"
              disabled={disabled}
              size={size}
            >
              {cities.map((cur: any) => (
                <Select.Option value={cur.name} key={cur.id}>
                  {cur.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Col>
      </Row>
    );
  }
}

export default Form.create<CitySelectorProps>()(CitySelector);
