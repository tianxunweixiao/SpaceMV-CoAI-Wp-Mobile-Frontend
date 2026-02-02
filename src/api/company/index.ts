import axiosInstance from '../../services/axiosConfig';

// 公司基本信息（预览和发布共用的结构）
interface CompanyInfo {
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
  companyName: string;
  copyrightInfo: string;
  versionNumber: string;
  companyAddress: string;
  addrUrl: string;
  securityRecord: string;
  icpRecord: string;
  businessCooperation: string;
  resumeDelivery: string;
  logoUrl: string;
}

// 关注设置项（预览和发布共用的结构）
interface FocusItem {
  createBy: string;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  savedBy: string;
  savedTime: string;
  publishedBy: string | null;
  publishedTime: string | null;
  remark: string;
  focusId: number;
  focusName: string;
  imageUrl: string;
  sortOrder: number;
  jumpUrl: string | null;
}

// 产品认证设置项（预览和发布共用的结构）
interface ProductCert {
  createBy: string;
  createTime: string | null;
  updateBy: string | null;
  updateTime: string | null;
  savedBy: string;
  savedTime: string;
  publishedBy: string | null;
  publishedTime: string | null;
  remark: string;
  certId: number;
  certName: string;
  imageUrl: string;
  sortOrder: number;
  jumpUrl: string | null;
}

// 公司简介模块（预览和发布共用的结构）
interface CompanyProfile {
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
  profileOne: string;
  profileTwo: string;
  profileThree: string;
}

// 公司信息配置响应类型
export interface CompanyInfoConfig {
  isPublish: string;
  txwxCompanyInfoTemp?: CompanyInfo;
  txwxFocusTemp?: FocusItem[];
  txwxProductCertsTemp?: ProductCert[];
  txwxCompanyProfileTemp?: CompanyProfile;
  txwxCompanyInfo?: CompanyInfo;
  txwxFocus?: FocusItem[];
  txwxProductCerts?: ProductCert[];
  txwxCompanyProfile?: CompanyProfile;
}

// 通用响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 获取公司信息配置
 * @returns Promise<ApiResponse<CompanyInfoConfig>>
 */
export function getCompanyInfoConfig(isPreview: boolean): Promise<ApiResponse<CompanyInfoConfig>> {
  // 内部获取URL中的type参数
  let type: string | null = null;
  if (typeof window !== 'undefined') {
    type = new URLSearchParams(window.location.search).get('type');
  }
  // 仅预览模式且type=company时使用预览接口
  const endpoint = (isPreview && type === 'company') 
    ? '/crm-website/companyDetail/preview' 
    : '/crm-website/companyDetail/display';
  return axiosInstance.get(endpoint);
}

// 辅助函数：根据发布状态获取对应的公司信息
export function getCompanyInfoByPublishStatus(config: CompanyInfoConfig) {
  return config.isPublish === '0' ? config.txwxCompanyInfoTemp : config.txwxCompanyInfo;
}

// 辅助函数：根据发布状态获取对应的关注设置
export function getFocusItemsByPublishStatus(config: CompanyInfoConfig) {
  return config.isPublish === '0' ? config.txwxFocusTemp : config.txwxFocus;
}

// 辅助函数：根据发布状态获取对应的产品认证
export function getProductCertsByPublishStatus(config: CompanyInfoConfig) {
  return config.isPublish === '0' ? config.txwxProductCertsTemp : config.txwxProductCerts;
}

// 辅助函数：根据发布状态获取对应的公司简介
export function getCompanyProfileByPublishStatus(config: CompanyInfoConfig) {
  return config.isPublish === '0' ? config.txwxCompanyProfileTemp : config.txwxCompanyProfile;
}