import axiosInstance from '../../services/axiosConfig';

// 轮播图数据类型
export interface CarouselImage {
  imageUrl: string;
  isShow: '0' | '1';
}

// 主要产品数据类型
export interface MainProduct {
  productName: string;
  imageUrl: string;
	jumpUrl?: string;
}

// 典型客户数据类型
export interface TypicalCustomers {
  imageUrl: string;
}

// 首页数据响应类型
export interface MainPageData {
  isPublish: '0' | '1';
  // 非预览模式字段
  carouselImageLists: CarouselImage[];
  mainProducts: MainProduct[];
  typicalCustomer: TypicalCustomers;
  // 预览模式字段
  carouselImageListsTemp: CarouselImage[];
  mainProductsTemp: MainProduct[];
  typicalCustomerTemp: TypicalCustomers;
}

// 通用响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 获取首页展示内容
 * @returns Promise<ApiResponse<MainPageData>>
 */

export function getMainPageContent(isPreview: boolean): Promise<ApiResponse<MainPageData>> {
  // 内部获取URL中的type参数
  let type: string | null = null;
  if (typeof window !== 'undefined') {
    type = new URLSearchParams(window.location.search).get('type');
  }
  // 仅预览模式且type=mainPage时使用预览接口
  const endpoint = (isPreview && type === 'mainPage') 
    ? '/crm-website/homepageConfig/preview' 
    : '/crm-website/homepageConfig/display';
  return axiosInstance.get(endpoint);
}