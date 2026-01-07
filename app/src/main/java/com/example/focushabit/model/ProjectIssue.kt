package com.example.focushabit.model

import java.time.LocalDate

/**
 * 프로젝트 이슈 엔티티
 * 프로젝트 관리 시스템의 이슈를 나타내는 데이터 모델
 * 
 * @property id 이슈 고유 식별자
 * @property title 이슈 제목
 * @property description 이슈 설명
 * @property status 이슈 상태 (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
 * @property priority 우선순위 (LOW, MEDIUM, HIGH, CRITICAL)
 * @property assignee 담당자 ID
 * @property projectId 프로젝트 ID
 * @property startDate 시작일자
 * @property endDate 종료일자
 * @property createdAt 생성일시
 * @property updatedAt 수정일시
 */
data class ProjectIssue(
    val id: String,
    val title: String,
    val description: String? = null,
    val status: IssueStatus = IssueStatus.OPEN,
    val priority: IssuePriority = IssuePriority.MEDIUM,
    val assignee: String? = null,
    val projectId: String,
    val startDate: LocalDate? = null,
    val endDate: LocalDate? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

/**
 * 이슈 상태 열거형
 */
enum class IssueStatus {
    OPEN,           // 열림
    IN_PROGRESS,    // 진행 중
    RESOLVED,       // 해결됨
    CLOSED          // 닫힘
}

/**
 * 이슈 우선순위 열거형
 */
enum class IssuePriority {
    LOW,        // 낮음
    MEDIUM,     // 보통
    HIGH,       // 높음
    CRITICAL    // 긴급
}

