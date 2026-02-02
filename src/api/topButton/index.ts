import axiosInstance from '../../services/axiosConfig';

// 按钮状态枚举 - 根据实际接口state字段映射
export enum ButtonStatus {
  complete = '1', // 外部链接
  completeSelf = '2', // 内部跳转
  completeNav = '3', // nav路由
  developing = '4' // 开发中
}


// 按钮类型枚举 - 根据实际接口buttonType字段映射
export enum ButtonType {
  text = '1', // 文字按钮
  image = '2' // 图片按钮
}

// 按钮接口类型 - 根据实际接口返回字段定义
export interface TopButton {
  buttonId: string;
  buttonType: ButtonType; // 按钮类型：1-文字按钮，2-图片按钮
  buttonText?: string; // 按钮文本
  backgroundColor?: string; // 背景颜色
  jumpUrl: string; // 跳转链接
  imageUrl?: string; // 图片URL
  isShow: string; // 是否对外显示：1-显示，0-隐藏
  state: ButtonStatus; // 状态：1-外部链接，2-内部跳转，3-nav路由，4-开发中
}

// 通用响应类型定义 - 根据实际接口返回格式
export interface ApiResponse<T = any> {
  code: number;
  msg: string; // 实际接口返回的是msg而不是message
  data: T;
}


/**
 * 获取顶部按钮列表
 * @param isPreview 是否为预览环境
 * @returns Promise<ApiResponse<TopButton[]>>
 */
export function getTopButtons(isPreview: boolean): Promise<ApiResponse<TopButton[]>> {
  // 在函数内部获取URL中的type参数
  let type: string | null = null;
  if (typeof window !== 'undefined') {
    type = new URLSearchParams(window.location.search).get('type');
  }
  
  // 根据环境和类型选择不同的API端点
  // 只有预览模式且type为"topButton"时，才调用预览接口
  const endpoint = (isPreview && type === 'topButton') 
    ? '/crm-website/buttonConfig/preview/001' 
    : '/crm-website/buttonConfig/display/001';
  return axiosInstance.get(endpoint);
}
