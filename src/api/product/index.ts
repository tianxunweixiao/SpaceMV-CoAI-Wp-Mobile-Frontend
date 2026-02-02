import axiosInstance from '../../services/axiosConfig';

// 基础信息接口（所有产品类型共用的字段结构）
interface BaseProductInfo {
  createBy: string;
  createTime: string | null;
  updateBy: string;
  updateTime: string | null;
  savedBy: string;
  savedTime: string;
  publishedBy: string;
  publishedTime: string | null;
  remark: string;
  id: number;
  productType: '1' | '2'; // 1: 产品一, 2: 产品二
  productName: string;
  productIntroduction: string;
  backgroundImageUrl: string;
  detailedIntroduction: string;
}

// 应用场景接口
interface ApplicationScenario {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  savedBy: string;
  savedTime: string;
  publishedBy: string | null;
  publishedTime: string | null;
  remark: string;
  scenarioId: number;
  productType: '1' | '2';
  scenarioName: string;
  scenarioIntroduction: string;
  iconUrl: string;
  backgroundImageUrl: string;
  detailedIntroduction: string;
  sortOrder: number;
}

// 典型案例产品接口
interface TypicalCaseProduct {
  createBy: string | null;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  savedBy: string;
  savedTime: string;
  publishedBy: string | null;
  publishedTime: string | null;
  remark: string;
  caseProductId: number;
  productType: '1' | '2';
  productName: string;
  productIntroduction: string;
  imageUrl: string;
  detailedIntroduction: string;
  sortOrder: number;
  standardFunctionsStr: string;
  customServicesStr: string;
  standardFunctions: string[];
  customServices: string[];
}

// 产品数据响应类型
export interface ProductData {
  isPublish: '0' | '1';
  // 预览模式字段
  txwxLLMProductBasicInfoTemp?: BaseProductInfo;
  txwxDeviceProductBasicInfoTemp?: BaseProductInfo;
  txwxLLMApplicationScenariosTemp?: ApplicationScenario[];
  txwxDeviceApplicationScenariosTemp?: ApplicationScenario[];
  txwxLLMTypicalCaseProductsTemp?: TypicalCaseProduct[];
  txwxDeviceTypicalCaseProductsTemp?: TypicalCaseProduct[];
  // 发布模式字段
  txwxLLMProductBasicInfo?: BaseProductInfo;
  txwxDeviceProductBasicInfo?: BaseProductInfo;
  txwxLLMApplicationScenarios?: ApplicationScenario[];
  txwxDeviceApplicationScenarios?: ApplicationScenario[];
  txwxLLMTypicalCaseProducts?: TypicalCaseProduct[];
  txwxDeviceTypicalCaseProducts?: TypicalCaseProduct[];
}

// 通用响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 获取产品信息配置
 * @returns Promise<ApiResponse<ProductData>>
 */
export function getProductInfoConfig(isPreview: boolean): Promise<ApiResponse<ProductData>> {
  // 内部获取URL中的type参数
  let type: string | null = null;
  if (typeof window !== 'undefined') {
    type = new URLSearchParams(window.location.search).get('type');
  }
  // 仅预览模式且type=product时使用预览接口
  const endpoint = (isPreview && type === 'product') 
    ? '/crm-website/productConfig/preview' 
    : '/crm-website/productConfig/display';
  return axiosInstance.get(endpoint);
}

// 辅助函数：根据发布状态获取对应的产品一产品基础信息
export function getLLMProductBasicInfoByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxLLMProductBasicInfoTemp : config.txwxLLMProductBasicInfo;
}

// 辅助函数：根据发布状态获取对应的产品二产品基础信息
export function getDeviceProductBasicInfoByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxDeviceProductBasicInfoTemp : config.txwxDeviceProductBasicInfo;
}

// 辅助函数：根据发布状态获取对应的产品一应用场景
export function getLLMApplicationScenariosByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxLLMApplicationScenariosTemp : config.txwxLLMApplicationScenarios;
}

// 辅助函数：根据发布状态获取对应的产品二应用场景
export function getDeviceApplicationScenariosByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxDeviceApplicationScenariosTemp : config.txwxDeviceApplicationScenarios;
}

// 辅助函数：根据发布状态获取对应的产品一典型案例产品
export function getLLMTypicalCaseProductsByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxLLMTypicalCaseProductsTemp : config.txwxLLMTypicalCaseProducts;
}

// 辅助函数：根据发布状态获取对应的产品二典型案例产品
export function getDeviceTypicalCaseProductsByPublishStatus(config: ProductData) {
  return config.isPublish === '0' ? config.txwxDeviceTypicalCaseProductsTemp : config.txwxDeviceTypicalCaseProducts;
}