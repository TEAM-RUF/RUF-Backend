import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils  # 그림 도구
mp_pose = mp.solutions.pose  # 포즈 추정 도구

# 스쿼트 카운팅 기준 각도
SQUAT_ANGLE_DOWN = 110
SQUAT_ANGLE_UP = 160

# 스쿼트 횟수, 상태
squat_count = 0
squat_stage = "up"

# 각도 계산 함수
def calculate_angle(a, b, c):
    a = np.array(a)  # 첫 지점
    b = np.array(b)  # 중간 지점
    c = np.array(c)  # 끝 지점

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

# 카메라 열기
cap = cv2.VideoCapture(0)

with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        ret, frame = cap.read()

        # 이미지 RGB 변환
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        # 포즈 추정
        results = pose.process(image)

        # 이미지 BGR 복구, 렌더링
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        try:
            landmarks = results.pose_landmarks.landmark

            # 오른쪽 다리 좌표
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

            # 오른쪽 다리 각도 계산
            angle_right = calculate_angle(right_hip, right_knee, right_ankle)

            # 각도 표시
            cv2.putText(image, str(angle_right),
                        tuple(np.multiply(right_knee, [640, 480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

            # 스쿼트 카운터 로직
            if angle_right > SQUAT_ANGLE_UP and squat_stage == "down":
                squat_stage = "up"
                squat_count += 1  # 횟수 증가
                print(squat_count)
            elif angle_right < SQUAT_ANGLE_DOWN:
                squat_stage = "down"

        except:
            pass

        # 횟수 문자열 및 크기 정의
        squat_text = str(squat_count)
        text_scale = 6  # 3배 크기
        text_thickness = 6 # 글씨 두께도 증가시켜야함
        font = cv2.FONT_HERSHEY_SIMPLEX

        # 텍스트 크기 및 중심 위치 계산
        text_size = cv2.getTextSize(squat_text, font, text_scale, text_thickness)[0]
        text_x = (image.shape[1] - text_size[0]) // 2
        text_y = (image.shape[0] + text_size[1]) // 2

        # 화면에 횟수 표시
        cv2.putText(image, squat_text,
                    (text_x, text_y), font, text_scale, (255, 255, 255), text_thickness, cv2.LINE_AA)

        cv2.imshow('Squat Counter Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()